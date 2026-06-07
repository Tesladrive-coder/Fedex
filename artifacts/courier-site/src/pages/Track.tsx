import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useTrackPackage, getTrackPackageQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { MapPin, Calendar, Package, AlertTriangle, Loader2, CheckCircle, Clock, Truck } from "lucide-react";
import { format } from "date-fns";

function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s.includes("delivered")) return { dot: "bg-green-500", bar: "bg-green-500", text: "text-green-700", bg: "bg-green-50" };
  if (s.includes("out")) return { dot: "bg-[#FF6200]", bar: "bg-[#FF6200]", text: "text-orange-700", bg: "bg-orange-50" };
  if (s.includes("transit")) return { dot: "bg-[#4D148C]", bar: "bg-[#4D148C]", text: "text-purple-700", bg: "bg-purple-50" };
  return { dot: "bg-gray-400", bar: "bg-gray-300", text: "text-gray-700", bg: "bg-gray-50" };
}

function statusIcon(status: string) {
  const s = status.toLowerCase();
  if (s.includes("delivered")) return <CheckCircle className="h-5 w-5 text-green-600" />;
  if (s.includes("out")) return <Truck className="h-5 w-5 text-[#FF6200]" />;
  return <Clock className="h-5 w-5 text-[#4D148C]" />;
}

export default function Track() {
  const searchParams = new URLSearchParams(useSearch());
  const initialNumber = searchParams.get("number") || "";

  const [trackingNumber, setTrackingNumber] = useState(initialNumber);
  const [inputValue, setInputValue] = useState(initialNumber);
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Track a Shipment | FedEx";
  }, []);

  const { data, isLoading, isError } = useTrackPackage(trackingNumber, {
    query: {
      enabled: !!trackingNumber,
      queryKey: getTrackPackageQueryKey(trackingNumber),
      refetchInterval: trackingNumber ? 5000 : false,
      refetchIntervalInBackground: false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      setTrackingNumber(trimmed);
      setLocation(`/track?number=${encodeURIComponent(trimmed)}`);
    }
  };

  const colors = data ? statusColor(data.status) : null;

  const demoCodes = [
    { code: "CPX1234567890", label: "In Transit" },
    { code: "CPX9876543210", label: "Delivered" },
    { code: "CPX5551234567", label: "Out for Delivery" },
    { code: "CPX1112223334", label: "Processing" },
  ];

  return (
    <Layout>
      {/* Header bar */}
      <div className="bg-[#4D148C] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-6">Track Your Shipment</h1>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="flex gap-0 max-w-2xl">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter tracking number"
              data-testid="input-track-number"
              className="flex-1 border-0 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200] rounded-l-sm placeholder-gray-400"
            />
            <button
              type="submit"
              data-testid="btn-track-submit"
              className="bg-[#FF6200] hover:bg-[#e05600] text-white font-bold text-sm px-6 py-3 rounded-r-sm transition-colors whitespace-nowrap"
            >
              Track
            </button>
          </form>

          {/* Demo codes */}
          <div className="mt-4">
            <p className="text-purple-200 text-xs font-semibold mb-2 uppercase tracking-wide">Demo tracking numbers you can use:</p>
            <div className="flex flex-wrap gap-2">
              {demoCodes.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setInputValue(code);
                    setTrackingNumber(code);
                    setLocation(`/track?number=${code}`);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-mono px-3 py-1.5 rounded-sm transition-colors border border-white/20 flex items-center gap-2"
                >
                  <span>{code}</span>
                  <span className="text-purple-300 text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Empty state */}
          {!trackingNumber && (
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">Enter a tracking number above</h3>
              <p className="text-gray-400 text-sm">
                Enter any FedEx tracking number to get shipment status and delivery details.
              </p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20 gap-3 text-[#4D148C]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-semibold">Looking up your shipment...</span>
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="bg-white border border-gray-200 rounded-sm p-8 max-w-2xl mx-auto text-center shadow-sm">
              <AlertTriangle className="h-12 w-12 text-[#FF6200] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tracking number not found</h3>
              <p className="text-gray-500 text-sm mb-6">
                We couldn't locate shipment <span className="font-mono font-bold text-gray-700">{trackingNumber}</span>. Please verify the number and try again.
              </p>
              <button
                onClick={() => { setInputValue(""); setTrackingNumber(""); setLocation("/track"); }}
                className="bg-[#4D148C] hover:bg-[#3a0f6f] text-white text-sm font-bold px-6 py-2.5 rounded-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Tracking result */}
          {data && !isLoading && !isError && colors && (
            <div className="space-y-6">
              {/* Status card */}
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className={`h-1.5 ${colors.bar}`} />
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Tracking ID</p>
                      <h2 className="text-xl font-black font-mono text-gray-900">{data.trackingNumber}</h2>
                      <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-sm text-sm font-bold ${colors.bg} ${colors.text}`}>
                        {statusIcon(data.status)}
                        {data.status}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 text-right md:border-l border-gray-100 md:pl-8">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 flex items-center justify-end gap-1">
                          <Calendar className="h-3 w-3" /> Estimated Delivery
                        </p>
                        <p className="text-base font-bold text-gray-900">
                          {data.estimatedDelivery
                            ? format(new Date(data.estimatedDelivery), "EEEE, MMM d, yyyy")
                            : "Pending"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Service</p>
                        <p className="text-sm font-semibold text-gray-700 capitalize">{data.service}</p>
                      </div>
                      {data.weight && (
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Weight</p>
                          <p className="text-sm font-semibold text-gray-700">{data.weight}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Route */}
                  <div className="mt-6 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Ship From</p>
                        <p className="font-bold text-gray-900">{data.origin}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FF6200]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="h-4 w-4 text-[#FF6200]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Deliver To</p>
                        <p className="font-bold text-gray-900">{data.destination}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-black text-gray-900">Shipment Activity</h3>
                </div>
                <div className="p-6">
                  {data.events && data.events.length > 0 ? (
                    <div className="relative">
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-200" />
                      <div className="space-y-6">
                        {[...data.events].reverse().map((event, index) => {
                          const isLatest = index === 0;
                          return (
                            <div key={index} className="flex gap-4 relative">
                              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ring-4 ring-white z-10 ${
                                isLatest ? `${colors.dot}` : "bg-gray-200"
                              }`}>
                                {isLatest
                                  ? <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                  : <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                }
                              </div>
                              <div className={`flex-1 pb-2 ${isLatest ? "" : "opacity-70"}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                  <p className={`font-bold text-sm ${isLatest ? "text-gray-900" : "text-gray-700"}`}>
                                    {event.status}
                                  </p>
                                  <p className="text-xs text-gray-400 font-mono">
                                    {format(new Date(event.timestamp), "MMM d, yyyy — h:mm a")}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600">{event.description}</p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                  <MapPin className="h-3 w-3" /> {event.location}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm text-center py-8">No tracking events yet. Check back soon.</p>
                  )}
                </div>
              </div>

              {/* Help links */}
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: "Request a Proof of Delivery", href: "/contact" },
                  { label: "File a Claim", href: "/contact" },
                  { label: "Contact FedEx Support", href: "/contact" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="bg-white border border-gray-200 rounded-sm p-4 text-sm font-semibold text-[#4D148C] hover:border-[#4D148C] hover:shadow-sm transition-all flex items-center justify-between"
                  >
                    {item.label}
                    <span className="text-gray-300">›</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
