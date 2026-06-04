import { useEffect, useState } from "react";
import { useSchedulePickup } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, Package, Clock, MapPin } from "lucide-react";

const pickupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  phone: z.string().min(7, "Phone number is required"),
  notes: z.string().optional(),
});

type PickupForm = z.infer<typeof pickupSchema>;

const timeSlots = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];

export default function SchedulePickup() {
  const { toast } = useToast();
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Schedule a Pickup | FedEx";
  }, []);

  const schedulePickup = useSchedulePickup();

  const form = useForm<PickupForm>({
    resolver: zodResolver(pickupSchema),
    defaultValues: { name: "", address: "", city: "", date: "", timeSlot: "", phone: "", notes: "" },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const onSubmit = (data: PickupForm) => {
    schedulePickup.mutate(
      { data: { ...data, notes: data.notes || null } },
      {
        onSuccess: (result) => {
          setConfirmationCode(result.confirmationCode);
          toast({ title: "Pickup Scheduled!", description: `Confirmation: ${result.confirmationCode}` });
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Could not schedule pickup. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-[#4D148C] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2">Schedule a Pickup</h1>
          <p className="text-purple-200">
            Have FedEx come to you. Schedule a free pickup from your home or business.
          </p>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Package className="h-4 w-4 text-[#4D148C]" /> Ready-to-ship packages only</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#FF6200]" /> Schedule up to 14 days in advance</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#4D148C]" /> Available at residential & business addresses</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success state */}
          {confirmationCode && (
            <div className="bg-white border border-green-200 rounded-sm p-8 text-center mb-8 shadow-sm">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-gray-900 mb-2">Pickup Confirmed!</h2>
              <p className="text-gray-500 mb-4">Your pickup has been scheduled. Please have your package ready.</p>
              <div className="inline-block bg-gray-50 border border-gray-200 rounded-sm px-6 py-3">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Confirmation Code</p>
                <p className="text-2xl font-black font-mono text-[#4D148C]">{confirmationCode}</p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setConfirmationCode(null)}
                  className="bg-[#FF6200] hover:bg-[#e05600] text-white font-bold text-sm px-6 py-2.5 rounded-sm transition-colors"
                >
                  Schedule Another Pickup
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {!confirmationCode && (
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
              <div className="bg-[#FF6200] px-6 py-4">
                <h2 className="text-white font-black text-lg">Pickup Details</h2>
              </div>
              <div className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Contact info */}
                    <div>
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 pb-2 border-b border-gray-100">Contact Information</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">Full Name *</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  data-testid="input-pickup-name"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C]"
                                  placeholder="John Smith"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phone Number *</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  data-testid="input-pickup-phone"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C]"
                                  placeholder="+1 (555) 000-0000"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 pb-2 border-b border-gray-100">Pickup Address</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">Street Address *</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  data-testid="input-pickup-address"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C]"
                                  placeholder="123 Main Street, Suite 100"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">City *</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  data-testid="input-pickup-city"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C]"
                                  placeholder="New York, NY"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Schedule */}
                    <div>
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 pb-2 border-b border-gray-100">Pickup Schedule</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">Pickup Date *</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  type="date"
                                  min={minDate}
                                  data-testid="input-pickup-date"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="timeSlot"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">Preferred Time *</FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  data-testid="select-pickup-timeslot"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C] bg-white"
                                >
                                  <option value="">Select a time slot...</option>
                                  {timeSlots.map((slot) => (
                                    <option key={slot} value={slot}>{slot}</option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">Special Instructions (optional)</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              rows={3}
                              data-testid="textarea-pickup-notes"
                              className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C] resize-none"
                              placeholder="Gate code, apartment number, package location..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button
                      type="submit"
                      disabled={schedulePickup.isPending}
                      data-testid="btn-pickup-submit"
                      className="bg-[#FF6200] hover:bg-[#e05600] disabled:opacity-50 text-white font-bold text-sm px-8 py-3 rounded-sm transition-colors flex items-center gap-2"
                    >
                      {schedulePickup.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      {schedulePickup.isPending ? "Scheduling..." : "Schedule Pickup"}
                    </button>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
