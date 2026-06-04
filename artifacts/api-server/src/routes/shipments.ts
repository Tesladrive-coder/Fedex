import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, shipmentsTable } from "@workspace/db";
import { CreateShipmentBody, GetShipmentParams } from "@workspace/api-zod";

const router: IRouter = Router();

function generateTrackingNumber(): string {
  const prefix = "CPX";
  const digits = Math.floor(Math.random() * 9000000000 + 1000000000);
  return `${prefix}${digits}`;
}

router.get("/shipments", async (_req, res): Promise<void> => {
  const shipments = await db
    .select()
    .from(shipmentsTable)
    .orderBy(shipmentsTable.createdAt);

  res.json(
    shipments.map((s) => ({
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
    }))
  );
});

router.post("/shipments", async (req, res): Promise<void> => {
  const parsed = CreateShipmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { service, origin, destination, weight, insured } = parsed.data;

  const serviceRates: Record<string, number> = {
    domestic: 12.99,
    international: 49.99,
    express: 29.99,
    overnight: 59.99,
  };
  const baseCost = serviceRates[service.toLowerCase()] ?? 14.99;
  const insuranceCost = insured ? 4.99 : 0;
  const totalCost = baseCost + insuranceCost;

  const trackingNumber = generateTrackingNumber();

  const today = new Date();
  const delivery = new Date(today);
  delivery.setDate(delivery.getDate() + (service === "express" ? 2 : service === "overnight" ? 1 : 5));
  const estimatedDelivery = delivery.toISOString().split("T")[0];

  const [shipment] = await db
    .insert(shipmentsTable)
    .values({
      trackingNumber,
      status: "processing",
      service,
      origin,
      destination,
      estimatedDelivery,
      weight,
      cost: totalCost.toFixed(2),
      insured: insured ?? false,
    })
    .returning();

  res.status(201).json({
    id: shipment.id,
    trackingNumber: shipment.trackingNumber,
    status: shipment.status,
    service: shipment.service,
    origin: shipment.origin,
    destination: shipment.destination,
    estimatedDelivery: shipment.estimatedDelivery ?? null,
    weight: shipment.weight ?? null,
    cost: shipment.cost !== null ? parseFloat(shipment.cost) : null,
    createdAt: shipment.createdAt.toISOString(),
    insured: shipment.insured,
  });
});

router.get("/shipments/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid shipment ID" });
    return;
  }

  const parsed = GetShipmentParams.safeParse({ id });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [shipment] = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.id, parsed.data.id));

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  res.json({
    id: shipment.id,
    trackingNumber: shipment.trackingNumber,
    status: shipment.status,
    service: shipment.service,
    origin: shipment.origin,
    destination: shipment.destination,
    estimatedDelivery: shipment.estimatedDelivery ?? null,
    weight: shipment.weight ?? null,
    cost: shipment.cost !== null ? parseFloat(shipment.cost) : null,
    createdAt: shipment.createdAt.toISOString(),
    insured: shipment.insured,
  });
});

export default router;
