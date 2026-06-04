import { Router, type IRouter } from "express";
import { db, contactsTable, pickupsTable } from "@workspace/db";
import { SubmitContactBody, SchedulePickupBody } from "@workspace/api-zod";

const router: IRouter = Router();

function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PU-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db.insert(contactsTable).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  res.json({
    success: true,
    message: "Thank you for your message. Our support team will contact you within 24 hours.",
  });
});

router.post("/pickup", async (req, res): Promise<void> => {
  const parsed = SchedulePickupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const confirmationCode = generateConfirmationCode();

  await db.insert(pickupsTable).values({
    name: parsed.data.name,
    address: parsed.data.address,
    city: parsed.data.city,
    date: parsed.data.date,
    timeSlot: parsed.data.timeSlot,
    phone: parsed.data.phone,
    notes: parsed.data.notes ?? null,
    confirmationCode,
  });

  res.json({
    success: true,
    confirmationCode,
    message: `Your pickup has been scheduled for ${parsed.data.date} between ${parsed.data.timeSlot}. Confirmation code: ${confirmationCode}`,
  });
});

export default router;
