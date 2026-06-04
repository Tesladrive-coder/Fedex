import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  useEffect(() => {
    document.title = "Pricing | SwiftLink Logistics";
  }, []);

  return (
    <Layout>
      <div className="bg-slate-900 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Choose the right tier for your shipping volume. No hidden fees, no surprises.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-6 bg-slate-50 w-1/4 rounded-tl-2xl">
                  <h3 className="text-xl font-bold mb-1">Features</h3>
                  <p className="text-sm text-muted-foreground font-normal">Compare what's included</p>
                </th>
                <th className="p-6 border-l border-border bg-white text-center w-1/4">
                  <h3 className="text-xl font-bold mb-1">Pay-As-You-Go</h3>
                  <p className="text-sm text-muted-foreground font-normal mb-4">For occasional shippers</p>
                  <p className="text-3xl font-bold mb-4">$0 <span className="text-base font-normal text-muted-foreground">/mo</span></p>
                  <Link href="/schedule-pickup">
                    <Button variant="outline" className="w-full">Sign Up Free</Button>
                  </Link>
                </th>
                <th className="p-6 border-l border-border bg-primary/5 text-center w-1/4 relative">
                  <div className="absolute top-0 left-0 right-0 bg-secondary text-white text-xs font-bold py-1 uppercase tracking-wider">Most Popular</div>
                  <h3 className="text-xl font-bold mb-1 mt-4 text-primary">Business Pro</h3>
                  <p className="text-sm text-muted-foreground font-normal mb-4">For growing businesses</p>
                  <p className="text-3xl font-bold mb-4">$49 <span className="text-base font-normal text-muted-foreground">/mo</span></p>
                  <Link href="/schedule-pickup">
                    <Button className="w-full bg-secondary hover:bg-secondary/90">Get Started</Button>
                  </Link>
                </th>
                <th className="p-6 border-l border-border bg-white text-center w-1/4 rounded-tr-2xl">
                  <h3 className="text-xl font-bold mb-1">Enterprise</h3>
                  <p className="text-sm text-muted-foreground font-normal mb-4">For large scale operations</p>
                  <p className="text-3xl font-bold mb-4">Custom</p>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">Contact Sales</Button>
                  </Link>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border border-b border-border">
              {[
                { feature: "Base Shipping Rate Discount", tiers: ["0%", "15%", "Up to 35%"] },
                { feature: "Monthly Shipment Volume", tiers: ["< 50", "50 - 500", "500+"] },
                { feature: "Real-time Tracking", tiers: [true, true, true] },
                { feature: "Basic Insurance (up to $100)", tiers: [true, true, true] },
                { feature: "Scheduled Pickups", tiers: ["$5/pickup", "Free", "Free (Daily)"] },
                { feature: "Dedicated Account Manager", tiers: [false, false, true] },
                { feature: "API Access", tiers: [false, true, true] },
                { feature: "Custom Branding on Tracking", tiers: [false, true, true] },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 font-medium border-r border-border">{row.feature}</td>
                  <td className="p-6 text-center border-r border-border">
                    {typeof row.tiers[0] === 'boolean' ? (
                      row.tiers[0] ? <Check className="mx-auto h-5 w-5 text-green-500" /> : <X className="mx-auto h-5 w-5 text-slate-300" />
                    ) : <span className="text-slate-600">{row.tiers[0]}</span>}
                  </td>
                  <td className="p-6 text-center border-r border-border bg-primary/5">
                    {typeof row.tiers[1] === 'boolean' ? (
                      row.tiers[1] ? <Check className="mx-auto h-5 w-5 text-green-500" /> : <X className="mx-auto h-5 w-5 text-slate-300" />
                    ) : <span className="font-semibold text-primary">{row.tiers[1]}</span>}
                  </td>
                  <td className="p-6 text-center">
                    {typeof row.tiers[2] === 'boolean' ? (
                      row.tiers[2] ? <Check className="mx-auto h-5 w-5 text-green-500" /> : <X className="mx-auto h-5 w-5 text-slate-300" />
                    ) : <span className="font-medium text-slate-600">{row.tiers[2]}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}