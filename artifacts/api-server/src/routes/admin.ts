import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq } from "drizzle-orm";
import { createHmac } from "crypto";
import { db, shipmentsTable, trackingEventsTable } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

function getExpectedToken(): string {
  const secret = process.env.SESSION_SECRET ?? "dev-secret";
  const password = process.env.ADMIN_PASSWORD ?? "admin";
  return createHmac("sha256", secret).update("admin-" + password).digest("hex");
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || token !== getExpectedToken()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// ---------------------------------------------------------------------------
// Auth endpoint (no token required)
// ---------------------------------------------------------------------------

router.post("/admin/auth", (req, res): void => {
  const { password } = req.body as { password?: string };

  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";

  if (!password || password !== adminPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  res.json({ token: getExpectedToken() });
});

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const AdminShipmentInputSchema = z.object({
  trackingNumber: z.string().min(1),
  service: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
  weight: z.string().min(1),
  estimatedDelivery: z.string().optional(),
  status: z.string().optional().default("processing"),
  insured: z.boolean().optional().default(false),
  cost: z.number().optional(),
});

const StatusUpdateSchema = z.object({
  status: z.string().min(1),
  estimatedDelivery: z.string().optional(),
});

const TrackingEventInputSchema = z.object({
  location: z.string().min(1),
  status: z.string().min(1),
  description: z.string().min(1),
  timestamp: z.string().optional(),
});

function mapShipment(s: typeof shipmentsTable.$inferSelect) {
  return {
    id: s.id,
    trackingNumber: s.trackingNumber,
    status: s.status,
    service: s.service,
    origin: s.origin,
    destination: s.destination,
    estimatedDelivery: s.estimatedDelivery ?? null,
    weight: s.weight ?? null,
    cost: s.cost !== null ? parseFloat(s.cost) : null,
    createdAt: s.createdAt.toISOString(),
    insured: s.insured,
  };
}

// ---------------------------------------------------------------------------
// Protected admin routes
// ---------------------------------------------------------------------------

router.get("/admin/shipments", requireAdminAuth, async (_req, res): Promise<void> => {
  const shipments = await db
    .select()
    .from(shipmentsTable)
    .orderBy(shipmentsTable.createdAt);
  res.json(shipments.map(mapShipment));
});

router.post("/admin/shipments", requireAdminAuth, async (req, res): Promise<void> => {
  const parsed = AdminShipmentInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { trackingNumber, service, origin, destination, weight, estimatedDelivery, status, insured, cost } = parsed.data;

  const existing = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.trackingNumber, trackingNumber));

  if (existing.length > 0) {
    res.status(400).json({ error: "Tracking number already exists" });
    return;
  }

  const today = new Date();
  const delivery = new Date(today);
  delivery.setDate(delivery.getDate() + (service === "express" ? 2 : service === "overnight" ? 1 : 5));
  const defaultDelivery = delivery.toISOString().split("T")[0];

  const [shipment] = await db
    .insert(shipmentsTable)
    .values({
      trackingNumber,
      status: status ?? "processing",
      service,
      origin,
      destination,
      estimatedDelivery: estimatedDelivery ?? defaultDelivery,
      weight,
      cost: cost !== undefined ? cost.toFixed(2) : null,
      insured: insured ?? false,
    })
    .returning();

  res.status(201).json(mapShipment(shipment));
});

router.patch("/admin/shipments/:trackingNumber/status", requireAdminAuth, async (req, res): Promise<void> => {
  const { trackingNumber } = req.params;

  const parsed = StatusUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateValues: Partial<typeof shipmentsTable.$inferInsert> = {
    status: parsed.data.status,
  };
  if (parsed.data.estimatedDelivery) {
    updateValues.estimatedDelivery = parsed.data.estimatedDelivery;
  }

  const [updated] = await db
    .update(shipmentsTable)
    .set(updateValues)
    .where(eq(shipmentsTable.trackingNumber, trackingNumber))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  res.json(mapShipment(updated));
});

router.post("/admin/shipments/:trackingNumber/events", requireAdminAuth, async (req, res): Promise<void> => {
  const { trackingNumber } = req.params;

  const [shipment] = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.trackingNumber, trackingNumber));

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  const parsed = TrackingEventInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { location, status, description, timestamp } = parsed.data;

  const [event] = await db
    .insert(trackingEventsTable)
    .values({
      trackingNumber,
      location,
      status,
      description,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    })
    .returning();

  res.status(201).json({
    timestamp: event.timestamp.toISOString(),
    location: event.location,
    status: event.status,
    description: event.description,
  });
});

router.delete("/admin/shipments/:trackingNumber", requireAdminAuth, async (req, res): Promise<void> => {
  const { trackingNumber } = req.params;

  const [deleted] = await db
    .delete(shipmentsTable)
    .where(eq(shipmentsTable.trackingNumber, trackingNumber))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  await db
    .delete(trackingEventsTable)
    .where(eq(trackingEventsTable.trackingNumber, trackingNumber));

  res.json({ success: true });
});

export default router;
