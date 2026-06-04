import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Contact FedEx | FedEx";
  }, []);

  const submitContact = useSubmitContact();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = (data: ContactForm) => {
    submitContact.mutate(
      { data: { ...data, phone: data.phone || null } },
      {
        onSuccess: () => {
          toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const subjects = [
    "Track a Shipment",
    "File a Claim",
    "Billing Inquiry",
    "Schedule a Pickup",
    "Technical Support",
    "Business Account",
    "Other",
  ];

  const contactCards = [
    {
      icon: Phone,
      title: "Phone Support",
      primary: "1.800.GoFedEx",
      secondary: "1.800.463.3339",
      note: "Available 24/7",
      color: "#4D148C",
    },
    {
      icon: Mail,
      title: "Email Support",
      primary: "support@fedex.com",
      secondary: "Response within 24 hours",
      note: "Mon–Fri, 8am–8pm EST",
      color: "#FF6200",
    },
    {
      icon: MapPin,
      title: "FedEx Locations",
      primary: "Find a FedEx location",
      secondary: "Drop off, pick up, or ship",
      note: "17,000+ locations in the US",
      color: "#4D148C",
    },
    {
      icon: Clock,
      title: "Operating Hours",
      primary: "FedEx Express: 24/7",
      secondary: "FedEx Ground: Mon–Sat",
      note: "Customer Service: 24/7",
      color: "#FF6200",
    },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="bg-[#4D148C] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2">Contact FedEx</h1>
          <p className="text-purple-200">We're here to help — 24 hours a day, 7 days a week.</p>
        </div>
      </div>

      {/* Contact cards */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((card) => (
              <div key={card.title} className="border border-gray-200 rounded-sm p-4 hover:shadow-sm transition-shadow">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center mb-3"
                  style={{ backgroundColor: card.color + "15" }}
                >
                  <card.icon className="h-5 w-5" style={{ color: card.color }} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{card.title}</h3>
                <p className="text-sm font-semibold" style={{ color: card.color }}>{card.primary}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.secondary}</p>
                <p className="text-xs text-gray-400 mt-1">{card.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form + FAQ */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div className="bg-[#FF6200] px-6 py-4">
                  <h2 className="text-white font-black text-lg">Send Us a Message</h2>
                </div>
                <div className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                                  data-testid="input-contact-name"
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
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Address *</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  type="email"
                                  data-testid="input-contact-email"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C]"
                                  placeholder="john@example.com"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phone (optional)</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  data-testid="input-contact-phone"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C]"
                                  placeholder="+1 (555) 000-0000"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">Subject *</FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  data-testid="select-contact-subject"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C] bg-white"
                                >
                                  <option value="">Select a subject...</option>
                                  {subjects.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wide">Message *</FormLabel>
                            <FormControl>
                              <textarea
                                {...field}
                                rows={5}
                                data-testid="textarea-contact-message"
                                className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C] resize-none"
                                placeholder="Describe your issue or question in detail..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <button
                        type="submit"
                        disabled={submitContact.isPending}
                        data-testid="btn-contact-submit"
                        className="bg-[#FF6200] hover:bg-[#e05600] disabled:opacity-50 text-white font-bold text-sm px-8 py-3 rounded-sm transition-colors flex items-center gap-2"
                      >
                        {submitContact.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {submitContact.isPending ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>

            {/* FAQ sidebar */}
            <div>
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div className="bg-[#4D148C] px-5 py-4">
                  <h3 className="text-white font-black text-base">Quick Answers</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    {
                      q: "How do I track my package?",
                      a: "Go to the Track page and enter your tracking number. You'll see real-time status and location updates.",
                    },
                    {
                      q: "What if my package is lost?",
                      a: "File a claim through our Contact form or call 1.800.GoFedEx. Claims are typically resolved within 5–7 business days.",
                    },
                    {
                      q: "How do I schedule a pickup?",
                      a: "Visit the Schedule Pickup page, fill in your address and preferred time, and we'll collect your package.",
                    },
                    {
                      q: "Can I change my delivery address?",
                      a: "Yes — use FedEx Delivery Manager to reroute or reschedule your delivery before it arrives.",
                    },
                    {
                      q: "What items are prohibited?",
                      a: "Hazardous materials, firearms, and certain chemicals are restricted. Contact us for the full prohibited items list.",
                    },
                  ].map((item) => (
                    <div key={item.q} className="p-4">
                      <p className="font-bold text-sm text-gray-900 mb-1">{item.q}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
