import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Layout } from "@/components/layout/Layout";
import {
  Package, Globe, Zap, Shield, Clock, ArrowRight, ChevronRight, Truck
} from "lucide-react";

const trackSchema = z.object({
  trackingNumber: z.string().min(1, "Please enter a tracking number"),
});

export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "FedEx - Track, Ship, Manage";
  }, []);

  const form = useForm<z.infer<typeof trackSchema>>({
    resolver: zodResolver(trackSchema),
    defaultValues: { trackingNumber: "" },
  });

  const onSubmit = (data: z.infer<typeof trackSchema>) => {
    setLocation(`/track?number=${encodeURIComponent(data.trackingNumber.trim())}`);
  };

  const services = [
    {
      icon: Zap,
      color: "#FF6200",
      title: "FedEx Express",
      desc: "When it absolutely, positively has to be there overnight. Time-definite delivery by morning.",
      href: "/services",
    },
    {
      icon: Truck,
      color: "#4D148C",
      title: "FedEx Ground",
      desc: "Cost-effective, day-definite delivery to every business and residential address in the US.",
      href: "/services",
    },
    {
      icon: Globe,
      color: "#4D148C",
      title: "FedEx International",
      desc: "Customs-cleared delivery to more than 220 countries and territories worldwide.",
      href: "/services",
    },
    {
      icon: Shield,
      color: "#FF6200",
      title: "FedEx Freight",
      desc: "Less-than-truckload (LTL) freight solutions for your heaviest and bulkiest shipments.",
      href: "/services",
    },
  ];

  const quickLinks = [
    { label: "Create a Shipment", href: "/schedule-pickup", icon: Package },
    { label: "Schedule a Pickup", href: "/schedule-pickup", icon: Clock },
    { label: "Get Rates & Transit Times", href: "/pricing", icon: ArrowRight },
    { label: "Open a FedEx Account", href: "/dashboard", icon: ChevronRight },
  ];

  return (
    <Layout>
      {/* Hero — FedEx style purple + tracking */}
      <section className="bg-[#4D148C]">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: headline + tracking form */}
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                Rely on us for all your shipping needs.
              </h1>
              <p className="text-purple-200 text-lg mb-8">
                Track packages, schedule pickups, and ship with confidence to over 220 countries.
              </p>

              {/* Tracking form */}
              <div className="bg-white rounded-sm shadow-lg overflow-hidden">
                <div className="bg-[#FF6200] px-5 py-3">
                  <h2 className="text-white font-bold text-base uppercase tracking-wide">Track a Shipment</h2>
                </div>
                <div className="p-5">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="trackingNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <input
                                {...field}
                                placeholder="Enter tracking number (e.g. CPX1234567890)"
                                data-testid="input-hero-tracking"
                                className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#4D148C] focus:ring-1 focus:ring-[#4D148C] placeholder-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <button
                          type="submit"
                          data-testid="btn-hero-track"
                          className="bg-[#FF6200] hover:bg-[#e05600] text-white font-bold text-sm px-6 py-2.5 rounded-sm transition-colors"
                        >
                          Track
                        </button>
                        <button
                          type="button"
                          className="text-[#4D148C] text-sm font-semibold hover:underline"
                          onClick={() => setLocation("/track")}
                        >
                          Advanced tracking options
                        </button>
                      </div>
                    </form>
                  </Form>

                  {/* Demo codes */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Demo tracking numbers:</p>
                    <div className="flex flex-wrap gap-2">
                      {["CPX1234567890", "CPX9876543210", "CPX5551234567", "CPX1112223334"].map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            form.setValue("trackingNumber", code);
                            setLocation(`/track?number=${code}`);
                          }}
                          className="text-[#4D148C] text-xs font-mono bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-1 rounded transition-colors"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: quick action links */}
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-sm p-6">
                <h3 className="text-white font-bold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickLinks.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setLocation(item.href)}
                      className="w-full flex items-center justify-between text-left text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-sm transition-colors group"
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orange strip */}
      <div className="bg-[#FF6200] py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white font-bold text-sm">
            Need help? Call 1.800.GoFedEx (1.800.463.3339) — available 24/7
          </p>
          <button
            onClick={() => setLocation("/contact")}
            className="text-white font-bold text-sm underline hover:no-underline whitespace-nowrap"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Services */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">FedEx Services</h2>
          <p className="text-gray-500 mb-8">Choose the service that fits your shipping needs and budget.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="border border-gray-200 rounded-sm p-6 hover:shadow-md transition-shadow group cursor-pointer"
                onClick={() => setLocation(service.href)}
              >
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center mb-4"
                  style={{ backgroundColor: service.color + "15" }}
                >
                  <service.icon className="h-6 w-6" style={{ color: service.color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#4D148C] transition-colors">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-[#4D148C] text-sm font-semibold">
                  Learn more <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-gray-50 border-y border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "99.9%", label: "On-Time Delivery Rate" },
              { value: "220+", label: "Countries & Territories" },
              { value: "15M+", label: "Packages Delivered Daily" },
              { value: "24/7", label: "Customer Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-black text-[#4D148C] mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Ship now */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#4D148C] rounded-sm overflow-hidden flex flex-col md:flex-row">
            <div className="flex-1 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                Ready to ship?
              </h2>
              <p className="text-purple-200 mb-8 max-w-md">
                Create your shipment in minutes. Get instant rates, print labels, and schedule a pickup — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setLocation("/schedule-pickup")}
                  data-testid="btn-cta-pickup"
                  className="bg-[#FF6200] hover:bg-[#e05600] text-white font-bold px-6 py-3 rounded-sm transition-colors text-sm"
                >
                  Schedule a Pickup
                </button>
                <button
                  onClick={() => setLocation("/pricing")}
                  data-testid="btn-cta-rates"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#4D148C] font-bold px-6 py-3 rounded-sm transition-colors text-sm"
                >
                  Get Rates
                </button>
              </div>
            </div>
            <div className="md:w-80 relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800&auto=format&fit=crop"
                alt="FedEx delivery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#4D148C] via-[#4D148C]/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">What customers are saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "FedEx has been our go-to shipping partner for 8 years. Their tracking system is second to none.",
                name: "Sarah M.",
                role: "Operations Director, RetailCo",
              },
              {
                quote: "International shipments used to be a headache. FedEx handles customs seamlessly — we just ship.",
                name: "James K.",
                role: "CEO, GlobalTech Imports",
              },
              {
                quote: "Overnight delivery, every time, without fail. Our medical supplies always arrive on time.",
                name: "Dr. Patricia N.",
                role: "Procurement Manager, MedSupply",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-sm p-6">
                <div className="text-[#FF6200] text-2xl font-black mb-3">"</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{t.quote}</p>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
