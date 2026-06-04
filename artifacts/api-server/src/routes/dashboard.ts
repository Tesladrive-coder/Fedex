import { Router, type IRouter } from "express";
import { db, shipmentsTable } from "@workspace/db";
import { desc, count, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [totals] = await db
    .select({
      totalShipments: count(),
    })
    .from(shipmentsTable);

  const activeStatuses = ["processing", "in-transit", "out-for-delivery"];
  const [active] = await db
    .select({ activeShipments: count() })
    .from(shipmentsTable)
    .where(sql`${shipmentsTable.status} = ANY(${activeStatuses})`);

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const [delivered] = await db
    .select({ deliveredThisMonth: count() })
    .from(shipmentsTable)
    .where(
      sql`${shipmentsTable.status} = 'delivered' AND ${shipmentsTable.updatedAt} >= ${firstOfMonth}`
    );

  const [totalCost] = await db
    .select({
      totalSpent: sql<string>`COALESCE(SUM(${shipmentsTable.cost}), 0)`,
    })
    .from(shipmentsTable);

  res.json({
    totalShipments: totals.totalShipments,
    activeShipments: active.activeShipments,
    deliveredThisMonth: delivered.deliveredThisMonth,
    pendingPickups: 0,
    totalSpent: parseFloat(totalCost.totalSpent),
  });
});

router.get("/dashboard/recent", async (_req, res): Promise<void> => {
  const shipments = await db
    .select()
    .from(shipmentsTable)
    .orderBy(desc(shipmentsTable.createdAt))
    .limit(10);

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

export default router;
