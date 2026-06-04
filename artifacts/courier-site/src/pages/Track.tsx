import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useTrackPackage, getTrackPackageQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Search, MapPin, Calendar, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function Track() {
  const searchParams = new URLSearchParams(useSearch());
  const initialTrackingNumber = searchParams.get("number") || "";
  
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [searchInput, setSearchInput] = useState(initialTrackingNumber);
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Track Package | SwiftLink Logistics";
  }, []);

  const { data: trackingData, isLoading, isError, error } = useTrackPackage(
    trackingNumber,
    { 
      query: { 
        enabled: !!trackingNumber, 
        queryKey: getTrackPackageQueryKey(trackingNumber) 
      } 
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTrackingNumber(searchInput.trim());
      setLocation(`/track?number=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <Layout>
      <div className="bg-slate-900 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-slate-900 to-slate-900"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Track Your Shipment</h1>
            <p className="text-lg text-slate-300 mb-8">
              Enter your tracking number to get real-time updates on your package status.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter tracking number (e.g., SL-10294857)"
                  className="pl-10 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-secondary focus-visible:border-transparent"
                  data-testid="input-track-number"
                />
              </div>
              <Button type="submit" className="h-14 px-8 text-base bg-secondary hover:bg-secondary/90 text-white" data-testid="btn-track-submit">
                Track Package
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        {!trackingNumber && !isLoading && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 max-w-4xl mx-auto">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Ready to track?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a valid tracking number above to see the current status and location of your shipment.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-40 bg-slate-100 animate-pulse rounded-xl"></div>
            <div className="h-64 bg-slate-100 animate-pulse rounded-xl"></div>
          </div>
        )}

        {isError && (
          <div className="max-w-4xl mx-auto">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-xl font-bold text-destructive mb-2">Tracking Number Not Found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any information for tracking number <strong>{trackingNumber}</strong>. Please check the number and try again.
                </p>
                <Button variant="outline" onClick={() => { setTrackingNumber(""); setSearchInput(""); setLocation("/track"); }}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {trackingData && !isLoading && !isError && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status Summary */}
            <Card className="border-border shadow-sm overflow-hidden">
              <div className={`h-2 ${
                trackingData.status === 'Delivered' ? 'bg-green-500' : 
                trackingData.status === 'In Transit' ? 'bg-secondary' : 'bg-primary'
              }`}></div>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Tracking Number</p>
                    <h2 className="text-2xl font-bold font-mono">{trackingData.trackingNumber}</h2>
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-sm font-semibold">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        trackingData.status === 'Delivered' ? 'bg-green-500' : 
                        trackingData.status === 'In Transit' ? 'bg-secondary' : 'bg-primary'
                      }`}></span>
                      {trackingData.status}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 text-right border-l-0 md:border-l pl-0 md:pl-8">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center justify-end gap-1 mb-1">
                        <Calendar className="h-4 w-4" /> Estimated Delivery
                      </p>
                      <p className="text-lg font-semibold">
                        {trackingData.estimatedDelivery 
                          ? format(new Date(trackingData.estimatedDelivery), "EEEE, MMMM do, yyyy") 
                          : "Pending calculation"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center justify-end gap-1 mb-1">
                        <Package className="h-4 w-4" /> Service Type
                      </p>
                      <p className="font-medium">{trackingData.service}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Origin</p>
                      <p className="font-medium">{trackingData.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Destination</p>
                      <p className="font-medium">{trackingData.destination}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <h3 className="text-xl font-bold mb-4 pt-4">Tracking History</h3>
            <Card>
              <CardContent className="p-0">
                <div className="relative border-l-2 border-slate-200 ml-8 md:ml-12 my-8">
                  {trackingData.events && trackingData.events.map((event, index) => (
                    <div key={index} className="mb-10 ml-6 md:ml-10 last:mb-0">
                      <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${
                        index === 0 ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {index === 0 ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                      </span>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                        <h4 className={`text-lg font-bold ${index === 0 ? 'text-foreground' : 'text-slate-600'}`}>
                          {event.status}
                        </h4>
                        <time className="text-sm font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">
                          {format(new Date(event.timestamp), "MMM dd, yyyy • HH:mm a")}
                        </time>
                      </div>
                      <p className="text-slate-600 mb-2">{event.description}</p>
                      <div className="flex items-center gap-1 text-sm font-medium text-slate-500">
                        <MapPin className="h-4 w-4" /> {event.location}
                      </div>
                    </div>
                  ))}
                  {(!trackingData.events || trackingData.events.length === 0) && (
                    <div className="p-8 text-center text-muted-foreground">
                      No tracking events available yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}