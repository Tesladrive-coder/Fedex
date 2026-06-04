import { useEffect } from "react";
import { useLocation } from "wouter";
import { useListServices } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Zap, Truck, Globe, Shield, Package, CheckCircle, Loader2 } from "lucide-react";

function getIcon(category: string) {
  switch (category) {
    case "express": return <Zap className="h-8 w-8" />;
    case "international": return <Globe className="h-8 w-8" />;
    case "freight": return <Truck className="h-8 w-8" />;
    case "addon": return <Shield className="h-8 w-8" />;
    default: return <Package className="h-8 w-8" />;
  }
}

function getColor(category: string) {
  return category === "express" || category === "addon" ? "#FF6200" : "#4D148C";
}

export default function Services() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Services | FedEx";
  }, []);

  const { data: services, isLoading } = useListServices();

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-[#4D148C] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2">FedEx Shipping Services</h1>
          <p className="text-purple-200 max-w-2xl">
            From overnight express to international freight — choose the service that fits your timeline and budget.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 text-xs text-gray-500">
          <span className="hover:text-[#4D148C] cursor-pointer" onClick={() => setLocation("/")}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Shipping Services</span>
        </div>
      </div>

      {/* Services grid */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-[#4D148C]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-semibold">Loading services...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(services ?? []).map((service) => {
                const color = getColor(service.category);
                return (
                  <div key={service.id} className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Color top bar */}
                    <div className="h-1.5" style={{ backgroundColor: color }} />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 rounded-sm" style={{ backgroundColor: color + "15" }}>
                          <span style={{ color }}>{getIcon(service.category)}</span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{service.description}</p>

                      <div className="flex items-center justify-between py-3 border-y border-gray-100 mb-4">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Delivery Time</p>
                          <p className="text-sm font-bold text-gray-900">{service.deliveryTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Starting from</p>
                          <p className="text-lg font-black" style={{ color }}>${service.priceFrom.toFixed(2)}</p>
                        </div>
                      </div>

                      <ul className="space-y-1.5 mb-5">
                        {service.features.slice(0, 4).map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color }} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => setLocation("/schedule-pickup")}
                        className="w-full py-2.5 text-sm font-bold rounded-sm transition-colors text-white"
                        style={{ backgroundColor: color }}
                      >
                        Ship with {service.name.split(" ")[1] || "FedEx"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FAQ strip */}
      <div className="bg-[#4D148C] py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-black text-xl mb-1">Not sure which service to choose?</h3>
            <p className="text-purple-200 text-sm">Our team can help you find the best option for your needs and budget.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setLocation("/pricing")}
              className="bg-white text-[#4D148C] font-bold text-sm px-5 py-2.5 rounded-sm hover:bg-purple-50 transition-colors"
            >
              Compare Pricing
            </button>
            <button
              onClick={() => setLocation("/contact")}
              className="bg-[#FF6200] text-white font-bold text-sm px-5 py-2.5 rounded-sm hover:bg-[#e05600] transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
