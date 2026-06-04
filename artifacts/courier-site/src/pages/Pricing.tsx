import { useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { CheckCircle, X } from "lucide-react";

const plans = [
  {
    id: "ground",
    name: "FedEx Ground",
    priceFrom: 12.99,
    delivery: "1–5 business days",
    color: "#4D148C",
    highlighted: false,
    features: [
      { label: "Real-time tracking", included: true },
      { label: "Residential delivery", included: true },
      { label: "Up to 150 lbs", included: true },
      { label: "Indirect signature", included: true },
      { label: "Saturday delivery", included: false },
      { label: "Money-back guarantee", included: false },
      { label: "International delivery", included: false },
    ],
  },
  {
    id: "express",
    name: "FedEx Express",
    priceFrom: 29.99,
    delivery: "1–3 business days",
    color: "#FF6200",
    highlighted: true,
    features: [
      { label: "Real-time tracking", included: true },
      { label: "Residential delivery", included: true },
      { label: "Up to 150 lbs", included: true },
      { label: "Indirect signature", included: true },
      { label: "Saturday delivery", included: true },
      { label: "Money-back guarantee", included: true },
      { label: "International delivery", included: false },
    ],
  },
  {
    id: "international",
    name: "FedEx International",
    priceFrom: 49.99,
    delivery: "5–14 business days",
    color: "#4D148C",
    highlighted: false,
    features: [
      { label: "Real-time tracking", included: true },
      { label: "Residential delivery", included: true },
      { label: "Up to 150 lbs", included: true },
      { label: "Customs clearance", included: true },
      { label: "Priority routing", included: true },
      { label: "Money-back guarantee", included: true },
      { label: "220+ countries", included: true },
    ],
  },
  {
    id: "overnight",
    name: "FedEx Overnight",
    priceFrom: 59.99,
    delivery: "Next business day",
    color: "#FF6200",
    highlighted: false,
    features: [
      { label: "Real-time tracking", included: true },
      { label: "Residential delivery", included: true },
      { label: "Up to 150 lbs", included: true },
      { label: "By 9am delivery", included: true },
      { label: "Saturday delivery", included: true },
      { label: "Money-back guarantee", included: true },
      { label: "International delivery", included: false },
    ],
  },
];

const addons = [
  { name: "Parcel Insurance", price: "from $4.99", desc: "Full value protection against loss or damage" },
  { name: "Signature Required", price: "from $5.00", desc: "Require a signature for delivery confirmation" },
  { name: "Saturday Delivery", price: "from $16.00", desc: "Guaranteed delivery on Saturday" },
  { name: "Address Correction", price: "$16.00", desc: "FedEx corrects an address error automatically" },
];

export default function Pricing() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Rates & Pricing | FedEx";
  }, []);

  return (
    <Layout>
      <div className="bg-[#4D148C] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2">Rates & Pricing</h1>
          <p className="text-purple-200 max-w-xl">
            Transparent pricing for every shipping need — no hidden fees, no surprises at checkout.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-black text-gray-900 mb-6">Choose Your Service</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-sm border overflow-hidden ${
                  plan.highlighted ? "border-[#FF6200] shadow-lg" : "border-gray-200"
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-[#FF6200] text-white text-xs font-bold text-center py-1.5 uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="h-1" style={{ backgroundColor: plan.color }} />
                <div className="p-5">
                  <h3 className="font-black text-gray-900 text-base mb-0.5">{plan.name}</h3>
                  <p className="text-xs text-gray-400 font-medium mb-3">{plan.delivery}</p>
                  <div className="mb-4">
                    <span className="text-xs text-gray-400 font-semibold">Starting from</span>
                    <div className="text-2xl font-black" style={{ color: plan.color }}>
                      ${plan.priceFrom.toFixed(2)}
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li key={f.label} className="flex items-center gap-2 text-xs">
                        {f.included
                          ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                          : <X className="h-3.5 w-3.5 flex-shrink-0 text-gray-300" />
                        }
                        <span className={f.included ? "text-gray-700" : "text-gray-400"}>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setLocation("/schedule-pickup")}
                    className="w-full py-2.5 text-sm font-bold rounded-sm transition-colors text-white"
                    style={{ backgroundColor: plan.color }}
                    data-testid={`btn-select-${plan.id}`}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-gray-900 mb-4">Optional Add-ons</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {addons.map((addon) => (
              <div key={addon.name} className="bg-white border border-gray-200 rounded-sm p-4">
                <h4 className="font-bold text-gray-900 text-sm mb-1">{addon.name}</h4>
                <p className="text-[#FF6200] font-black text-base mb-2">{addon.price}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{addon.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-sm p-5 text-sm text-purple-800">
            <strong>Note:</strong> All prices shown are base rates. Final pricing depends on package dimensions, weight, distance, and any additional services selected. Contact our team for volume discounts and custom business rates.
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="font-black text-gray-900 text-xl mb-2">Ready to get an exact quote?</h3>
          <p className="text-gray-500 text-sm mb-6">Use our rate calculator or speak to a shipping specialist.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setLocation("/schedule-pickup")}
              className="bg-[#FF6200] hover:bg-[#e05600] text-white font-bold text-sm px-6 py-3 rounded-sm transition-colors"
              data-testid="btn-ship-now"
            >
              Ship Now
            </button>
            <button
              onClick={() => setLocation("/contact")}
              className="bg-white border-2 border-[#4D148C] text-[#4D148C] hover:bg-purple-50 font-bold text-sm px-6 py-3 rounded-sm transition-colors"
              data-testid="btn-get-quote"
            >
              Get a Custom Quote
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
