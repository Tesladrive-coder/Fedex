import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  useGetDashboardStats,
  useGetRecentShipments,
  useListShipments,
} from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Package, TrendingUp, Clock, CheckCircle, DollarSign, Loader2, MapPin, ExternalLink } from "lucide-react";

type Tab = "overview" | "shipments" | "account";

function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s.includes("delivered")) return "bg-green-100 text-green-800";
  if (s.includes("out")) return "bg-orange-100 text-orange-800";
  if (s.includes("transit")) return "bg-purple-100 text-purple-800";
  if (s.includes("processing")) return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-700";
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "My Dashboard | FedEx";
  }, []);

  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: recent, isLoading: recentLoading } = useGetRecentShipments();
  const { data: allShipments, isLoading: allLoading } = useListShipments();

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "shipments", label: "My Shipments" },
    { id: "account", label: "Account Settings" },
  ];

  const statCards = [
    {
      label: "Total Shipments",
      value: stats?.totalShipments ?? 0,
      icon: Package,
      color: "#4D148C",
      loading: statsLoading,
    },
    {
      label: "Active Shipments",
      value: stats?.activeShipments ?? 0,
      icon: TrendingUp,
      color: "#FF6200",
      loading: statsLoading,
    },
    {
      label: "Delivered This Month",
      value: stats?.deliveredThisMonth ?? 0,
      icon: CheckCircle,
      color: "#4D148C",
      loading: statsLoading,
    },
    {
      label: "Total Spent",
      value: stats ? `$${stats.totalSpent.toFixed(2)}` : "$0.00",
      icon: DollarSign,
      color: "#FF6200",
      loading: statsLoading,
    },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="bg-[#4D148C] py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white mb-1">My FedEx Dashboard</h1>
            <p className="text-purple-200">Manage your shipments, track packages, and view account details.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setLocation("/schedule-pickup")}
              className="bg-[#FF6200] hover:bg-[#e05600] text-white font-bold text-sm px-5 py-2.5 rounded-sm transition-colors"
              data-testid="btn-dashboard-pickup"
            >
              Schedule Pickup
            </button>
            <button
              onClick={() => setLocation("/track")}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-sm transition-colors border border-white/20"
              data-testid="btn-dashboard-track"
            >
              Track Package
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`tab-${tab.id}`}
                className={`px-5 py-4 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#4D148C] text-[#4D148C]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                  <div key={card.label} className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.label}</p>
                      <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: card.color + "15" }}>
                        <card.icon className="h-4 w-4" style={{ color: card.color }} />
                      </div>
                    </div>
                    {card.loading
                      ? <div className="h-8 w-20 bg-gray-100 animate-pulse rounded" />
                      : <p className="text-2xl font-black text-gray-900">{card.value}</p>
                    }
                  </div>
                ))}
              </div>

              {/* Recent shipments */}
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-black text-gray-900">Recent Shipments</h3>
                  <button
                    onClick={() => setActiveTab("shipments")}
                    className="text-[#4D148C] text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    View all <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
                {recentLoading ? (
                  <div className="flex items-center justify-center py-12 gap-2 text-[#4D148C]">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-semibold">Loading shipments...</span>
                  </div>
                ) : (recent ?? []).length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No shipments yet</p>
                    <button
                      onClick={() => setLocation("/schedule-pickup")}
                      className="mt-4 text-[#4D148C] text-sm font-bold hover:underline"
                    >
                      Create your first shipment
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {(recent ?? []).slice(0, 5).map((shipment) => (
                      <div
                        key={shipment.id}
                        data-testid={`row-shipment-${shipment.id}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors gap-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-sm bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <Package className="h-4 w-4 text-[#4D148C]" />
                          </div>
                          <div>
                            <p className="font-mono font-bold text-sm text-gray-900">{shipment.trackingNumber}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              {shipment.origin} → {shipment.destination}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-sm capitalize ${statusColor(shipment.status)}`}>
                            {shipment.status}
                          </span>
                          <button
                            onClick={() => setLocation(`/track?number=${shipment.trackingNumber}`)}
                            className="text-[#4D148C] text-xs font-bold hover:underline whitespace-nowrap"
                          >
                            Track
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Track a Package", desc: "Real-time shipment status", href: "/track", color: "#4D148C" },
                  { label: "Schedule a Pickup", desc: "Free pickup from your location", href: "/schedule-pickup", color: "#FF6200" },
                  { label: "Get a Rate Quote", desc: "Compare services and prices", href: "/pricing", color: "#4D148C" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setLocation(item.href)}
                    className="bg-white border border-gray-200 rounded-sm p-5 text-left hover:shadow-md transition-shadow group"
                  >
                    <p className="font-black text-gray-900 text-sm mb-1 group-hover:text-[#4D148C] transition-colors">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Shipments Tab */}
          {activeTab === "shipments" && (
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900">All Shipments</h3>
                <span className="text-xs text-gray-400 font-medium">{(allShipments ?? []).length} total</span>
              </div>
              {allLoading ? (
                <div className="flex items-center justify-center py-16 gap-2 text-[#4D148C]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-semibold">Loading...</span>
                </div>
              ) : (allShipments ?? []).length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">No shipments found</p>
                </div>
              ) : (
                <>
                  {/* Table header */}
                  <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    <span>Tracking #</span>
                    <span>Route</span>
                    <span>Service</span>
                    <span>Status</span>
                    <span>Est. Delivery</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {(allShipments ?? []).map((shipment) => (
                      <div
                        key={shipment.id}
                        data-testid={`row-all-shipment-${shipment.id}`}
                        className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                      >
                        <button
                          onClick={() => setLocation(`/track?number=${shipment.trackingNumber}`)}
                          className="font-mono text-sm font-bold text-[#4D148C] hover:underline text-left"
                        >
                          {shipment.trackingNumber}
                        </button>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{shipment.origin} → {shipment.destination}</span>
                        </div>
                        <span className="text-xs text-gray-600 font-medium capitalize">{shipment.service}</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-sm capitalize w-fit ${statusColor(shipment.status)}`}>
                          {shipment.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {shipment.estimatedDelivery
                            ? new Date(shipment.estimatedDelivery).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="max-w-2xl">
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className="bg-[#4D148C] px-6 py-4">
                  <h3 className="text-white font-black text-base">Account Information</h3>
                </div>
                <div className="p-6 space-y-5">
                  {[
                    { label: "Account Number", value: "FX-8847201-US" },
                    { label: "Account Type", value: "FedEx Business Account" },
                    { label: "Member Since", value: "January 2024" },
                    { label: "Preferred Service", value: "FedEx Express" },
                    { label: "Email Notifications", value: "Enabled" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                  <div className="pt-4">
                    <button
                      onClick={() => setLocation("/contact")}
                      className="bg-[#FF6200] hover:bg-[#e05600] text-white font-bold text-sm px-6 py-2.5 rounded-sm transition-colors"
                      data-testid="btn-account-contact"
                    >
                      Contact Account Manager
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-sm p-4 text-sm text-purple-800">
                <strong>Demo Mode:</strong> This dashboard displays live data from the database. Shipments created via the API are shown in real time.
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
