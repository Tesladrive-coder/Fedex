import { pgTable, serial, text, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const shipmentsTable = pgTable("shipments", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull().unique(),
  status: text("status").notNull().default("processing"),
  service: text("service").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  estimatedDelivery: text("estimated_delivery"),
  weight: text("weight"),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  insured: boolean("insured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertShipmentSchema = createInsertSchema(shipmentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipmentsTable.$inferSelect;

export const trackingEventsTable = pgTable("tracking_events", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  location: text("location").notNull(),
  status: text("status").notNull(),
  description: text("description").notNull(),
});

export const insertTrackingEventSchema = createInsertSchema(trackingEventsTable).omit({ id: true });
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;
export type TrackingEvent = typeof trackingEventsTable.$inferSelect;
