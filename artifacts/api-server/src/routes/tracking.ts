import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, shipmentsTable, trackingEventsTable } from "@workspace/db";
import { TrackPackageParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/track/:trackingNumber", async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = TrackPackageParams.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { trackingNumber } = parsed.data;

    const [shipment] = await db
      .select()
      .from(shipmentsTable)
      .where(eq(shipmentsTable.trackingNumber, trackingNumber));

    if (!shipment) {
      res.status(404).json({ error: "Tracking number not found" });
      return;
    }

    const events = await db
      .select()
      .from(trackingEventsTable)
      .where(eq(trackingEventsTable.trackingNumber, trackingNumber))
      .orderBy(trackingEventsTable.timestamp);

    res.json({
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery ?? null,
      origin: shipment.origin,
      destination: shipment.destination,
      service: shipment.service,
      weight: shipment.weight ?? null,
      events: events.map((e) => ({
        timestamp: e.timestamp.toISOString(),
        location: e.location,
        status: e.status,
        description: e.description,
      })),
    });
  } catch (error) {
    console.error("Error tracking shipment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
