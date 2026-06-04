import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Search, Package, Globe, Clock, ShieldCheck, 
  ArrowRight, CheckCircle2, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const trackingSchema = z.object({
  trackingNumber: z.string().min(1, "Please enter a tracking number")
});

export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Home | SwiftLink Logistics";
  }, []);

  const form = useForm<z.infer<typeof trackingSchema>>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      trackingNumber: ""
    }
  });

  const onSubmit = (data: z.infer<typeof trackingSchema>) => {
    setLocation(`/track?number=${encodeURIComponent(data.trackingNumber)}`);
  };

  const services = [
    { icon: Globe, title: "Global Freight", desc: "Seamless international shipping across 220+ countries with customs clearance." },
    { icon: Clock, title: "Express Delivery", desc: "Same-day and next-day delivery options for urgent time-critical packages." },
    { icon: ShieldCheck, title: "Secure Transport", desc: "Fully insured shipping for high-value items with continuous monitoring." }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
            alt="Logistics Warehouse" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-4 border border-secondary/30">
                Premium Global Logistics
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                Fast, Reliable Delivery <br />
                <span className="text-secondary">Without Compromise.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl">
                We bridge distances with advanced logistics technology and a dedicated global network. Track your shipment in real-time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-4 md:p-6 rounded-xl shadow-2xl max-w-2xl"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-3">
                  <FormField
                    control={form.control}
                    name="trackingNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input 
                              placeholder="Enter your tracking number (e.g., SL-10294857)" 
                              className="pl-10 h-14 text-lg bg-slate-50 border-transparent focus-visible:ring-secondary"
                              data-testid="input-hero-tracking"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="h-14 px-8 text-base bg-secondary hover:bg-secondary/90 text-white shadow-lg"
                    data-testid="btn-hero-track"
                  >
                    Track Package
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Core Logistics Solutions</h2>
            <p className="text-lg text-muted-foreground">
              From local deliveries to complex international supply chains, we provide the infrastructure your business needs to thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow bg-white hover:-translate-y-1 duration-300">
                  <CardContent className="p-8">
                    <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {service.desc}
                    </p>
                    <Button variant="link" className="p-0 h-auto text-secondary hover:text-secondary/80 font-semibold group">
                      Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/5"
              onClick={() => setLocation("/services")}
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-white/70 font-medium">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">220+</div>
              <div className="text-white/70 font-medium">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15M+</div>
              <div className="text-white/70 font-medium">Packages Annually</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-white/70 font-medium">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-10 md:p-16 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to ship with confidence?</h2>
              <p className="text-slate-300 mb-8 text-lg">
                Create an account today to schedule pickups, manage multiple shipments, and access volume discounts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-secondary hover:bg-secondary/90 text-white h-12 px-8 text-base"
                  onClick={() => setLocation("/schedule-pickup")}
                >
                  Schedule Pickup
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10 h-12 px-8 text-base"
                  onClick={() => setLocation("/contact")}
                >
                  Contact Sales
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto w-full relative">
              <img 
                src="https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=2070&auto=format&fit=crop" 
                alt="Delivery professional" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}