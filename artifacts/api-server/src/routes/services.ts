import { Router, type IRouter } from "express";

const router: IRouter = Router();

const SERVICES = [
  {
    id: "domestic",
    name: "Domestic Delivery",
    description: "Reliable door-to-door delivery across the country within 3-5 business days.",
    deliveryTime: "3-5 business days",
    priceFrom: 12.99,
    category: "standard",
    features: ["Real-time tracking", "Signature confirmation", "SMS notifications", "Up to 30kg"],
  },
  {
    id: "international",
    name: "International Shipping",
    description: "Worldwide delivery to over 220 countries with full customs support and tracking.",
    deliveryTime: "5-14 business days",
    priceFrom: 49.99,
    category: "international",
    features: ["Customs clearance", "Worldwide coverage", "Duty & tax assistance", "Priority routing"],
  },
  {
    id: "express",
    name: "Express Delivery",
    description: "Fast priority shipping with guaranteed 1-2 day delivery for time-sensitive parcels.",
    deliveryTime: "1-2 business days",
    priceFrom: 29.99,
    category: "express",
    features: ["Guaranteed delivery", "Priority handling", "Live tracking", "Weekend delivery"],
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    description: "Next-business-day delivery by 9am for your most urgent shipments.",
    deliveryTime: "Next business day",
    priceFrom: 59.99,
    category: "express",
    features: ["9am delivery", "Money-back guarantee", "Proof of delivery", "Dedicated support"],
  },
  {
    id: "parcel-insurance",
    name: "Parcel Insurance",
    description: "Comprehensive coverage protecting your shipments against loss, theft, or damage in transit.",
    deliveryTime: "Add-on to any service",
    priceFrom: 4.99,
    category: "addon",
    features: ["Full value coverage", "Claims within 48h", "No hidden fees", "Digital claims process"],
  },
  {
    id: "freight",
    name: "Freight & Bulk",
    description: "Cost-effective solutions for heavy shipments, pallets, and bulk cargo nationwide.",
    deliveryTime: "5-7 business days",
    priceFrom: 99.99,
    category: "freight",
    features: ["Pallet shipping", "Loading assistance", "Door-to-door", "Tracking included"],
  },
];

router.get("/services", async (_req, res): Promise<void> => {
  res.json(SERVICES);
});

export default router;
