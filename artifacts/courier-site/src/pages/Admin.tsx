import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminListShipments,
  getAdminListShipmentsQueryKey,
  useAdminCreateShipment,
  useAdminUpdateStatus,
  useAdminAddEvent,
  useAdminDeleteShipment,
} from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import {
  Package,
  Plus,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const STATUSES = [
  "processing",
  "in-transit",
  "out-for-delivery",
  "delivered",
  "on-hold",
  "exception",
];

const SERVICES = ["express", "overnight", "domestic", "international"];

function statusBadge(status: string) {
  const s = status.toLowerCase();
  if (s.includes("delivered")) return "bg-green-100 text-green-800";
  if (s.includes("out")) return "bg-orange-100 text-orange-800";
  if (s.includes("transit")) return "bg-purple-100 text-purple-800";
  if (s.includes("processing")) return "bg-blue-100 text-blue-800";
  if (s.includes("hold") || s.includes("exception")) return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
}

function statusIcon(status: string) {
  const s = status.toLowerCase();
  if (s.includes("delivered")) return <CheckCircle className="h-4 w-4 text-green-600" />;
  if (s.includes("out")) return <Truck className="h-4 w-4 text-orange-500" />;
  if (s.includes("transit")) return <Truck className="h-4 w-4 text-purple-600" />;
  return <Clock className="h-4 w-4 text-blue-600" />;
}

type Shipment = {
  id: number;
  trackingNumber: string;
  status: string;
  service: string;
  origin: string;
  destination: string;
  estimatedDelivery?: string | null;
  weight?: string | null;
};

export default function Admin() {
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Admin Panel | FedEx";
  }, []);

  const { data: shipments, isLoading, refetch } = useAdminListShipments({
    query: { queryKey: getAdminListShipmentsQueryKey(), refetchInterval: 5000 },
  });

  const createMutation = useAdminCreateShipment();
  const statusMutation = useAdminUpdateStatus();
  const eventMutation = useAdminAddEvent();
  const deleteMutation = useAdminDeleteShipment();

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newShipment, setNewShipment] = useState({
    trackingNumber: "",
    origin: "",
    destination: "",
    service: "express",
    weight: "",
    estimatedDelivery: "",
    status: "processing",
    insured: false,
  });

  const [statusUpdates, setStatusUpdates] = useState<Record<string, { status: string; estimatedDelivery: string }>>({});
  const [newEvents, setNewEvents] = useState<Record<string, { location: string; status: string; description: string }>>({});

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getAdminListShipmentsQueryKey() });
  }

  function handleCreateShipment(e: React.FormEvent) {
    e.preventDefault();
    if (!newShipment.trackingNumber.trim()) { showToast("Tracking number is required", "error"); return; }
    createMutation.mutate(
      { data: { ...newShipment, weight: newShipment.weight || "1.0 kg" } },
      {
        onSuccess: () => {
          showToast(`Shipment ${newShipment.trackingNumber} created`);
          setNewShipment({ trackingNumber: "", origin: "", destination: "", service: "express", weight: "", estimatedDelivery: "", status: "processing", insured: false });
          setShowCreateForm(false);
          invalidate();
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Failed to create shipment";
          showToast(msg, "error");
        },
      }
    );
  }

  function handleStatusUpdate(trackingNumber: string) {
    const update = statusUpdates[trackingNumber];
    if (!update?.status) return;
    statusMutation.mutate(
      { trackingNumber, data: { status: update.status, estimatedDelivery: update.estimatedDelivery || undefined } },
      {
        onSuccess: () => {
          showToast(`Status updated to "${update.status}"`);
          invalidate();
        },
        onError: () => showToast("Failed to update status", "error"),
      }
    );
  }

  function handleAddEvent(trackingNumber: string) {
    const ev = newEvents[trackingNumber];
    if (!ev?.location || !ev?.status || !ev?.description) {
      showToast("All event fields are required", "error");
      return;
    }
    eventMutation.mutate(
      { trackingNumber, data: ev },
      {
        onSuccess: () => {
          showToast("Tracking event added");
          setNewEvents((prev) => ({ ...prev, [trackingNumber]: { location: "", status: "", description: "" } }));
          invalidate();
        },
        onError: () => showToast("Failed to add event", "error"),
      }
    );
  }

  function handleDelete(trackingNumber: string) {
    if (!confirm(`Delete shipment ${trackingNumber}? This cannot be undone.`)) return;
    deleteMutation.mutate(
      { trackingNumber },
      {
        onSuccess: () => { showToast(`Shipment ${trackingNumber} deleted`); invalidate(); },
        onError: () => showToast("Failed to delete", "error"),
      }
    );
  }

  function getStatusUpdate(tn: string, current: string) {
    return statusUpdates[tn] ?? { status: current, estimatedDelivery: "" };
  }

  function getEventFields(tn: string) {
    return newEvents[tn] ?? { location: "", status: "", description: "" };
  }

  return (
    <Layout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-sm shadow-lg text-sm font-semibold text-white transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#4D148C] py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">Admin Panel</h1>
            <p className="text-purple-200 text-sm mt-1">Manage shipments, update statuses, push tracking events</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-sm transition-colors border border-white/20"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              onClick={() => setShowCreateForm((v) => !v)}
              className="flex items-center gap-2 bg-[#FF6200] hover:bg-[#e05600] text-white text-sm font-bold px-4 py-2 rounded-sm transition-colors"
            >
              <Plus className="h-4 w-4" /> New Shipment
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

          {/* Create shipment form */}
          {showCreateForm && (
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[#FF6200] px-6 py-3 flex items-center gap-2">
                <Plus className="h-4 w-4 text-white" />
                <h2 className="font-black text-white text-sm uppercase tracking-wide">Create New Shipment</h2>
              </div>
              <form onSubmit={handleCreateShipment} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Tracking Number *</label>
                  <input
                    value={newShipment.trackingNumber}
                    onChange={(e) => setNewShipment((p) => ({ ...p, trackingNumber: e.target.value.toUpperCase() }))}
                    placeholder="e.g. CPX1234567890"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4D148C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Origin *</label>
                  <input
                    value={newShipment.origin}
                    onChange={(e) => setNewShipment((p) => ({ ...p, origin: e.target.value }))}
                    placeholder="e.g. Lagos, Nigeria"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Destination *</label>
                  <input
                    value={newShipment.destination}
                    onChange={(e) => setNewShipment((p) => ({ ...p, destination: e.target.value }))}
                    placeholder="e.g. Abuja, FCT"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Service</label>
                  <select
                    value={newShipment.service}
                    onChange={(e) => setNewShipment((p) => ({ ...p, service: e.target.value }))}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C]"
                  >
                    {SERVICES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Weight</label>
                  <input
                    value={newShipment.weight}
                    onChange={(e) => setNewShipment((p) => ({ ...p, weight: e.target.value }))}
                    placeholder="e.g. 2.5 kg"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Estimated Delivery</label>
                  <input
                    type="date"
                    value={newShipment.estimatedDelivery}
                    onChange={(e) => setNewShipment((p) => ({ ...p, estimatedDelivery: e.target.value }))}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Initial Status</label>
                  <select
                    value={newShipment.status}
                    onChange={(e) => setNewShipment((p) => ({ ...p, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C]"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-end gap-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newShipment.insured}
                      onChange={(e) => setNewShipment((p) => ({ ...p, insured: e.target.checked }))}
                      className="w-4 h-4 accent-[#4D148C]"
                    />
                    Insured
                  </label>
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-[#4D148C] hover:bg-[#3a0f6f] text-white text-sm font-bold px-6 py-2.5 rounded-sm transition-colors disabled:opacity-60 flex items-center gap-2"
                  >
                    {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Shipment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Shipments table */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-[#4D148C]" />
                All Shipments
                {shipments && <span className="ml-2 text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{shipments.length}</span>}
              </h2>
              <p className="text-xs text-gray-400">Auto-refreshes every 5 seconds</p>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-16 gap-3 text-[#4D148C]">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-semibold text-sm">Loading shipments...</span>
              </div>
            )}

            {!isLoading && (!shipments || shipments.length === 0) && (
              <div className="py-16 text-center">
                <Package className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-semibold">No shipments yet. Create one above.</p>
              </div>
            )}

            {shipments && shipments.length > 0 && (
              <div className="divide-y divide-gray-100">
                {shipments.map((shipment: Shipment) => {
                  const isExpanded = expandedRow === shipment.trackingNumber;
                  const su = getStatusUpdate(shipment.trackingNumber, shipment.status);
                  const ef = getEventFields(shipment.trackingNumber);

                  return (
                    <div key={shipment.trackingNumber}>
                      {/* Row */}
                      <div
                        className="px-6 py-4 flex flex-wrap items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedRow(isExpanded ? null : shipment.trackingNumber)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="font-black font-mono text-sm text-gray-900">{shipment.trackingNumber}</span>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${statusBadge(shipment.status)}`}>
                              {statusIcon(shipment.status)}
                              {shipment.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{shipment.origin}</span>
                            <span>→</span>
                            <span>{shipment.destination}</span>
                            <span className="capitalize text-gray-400">• {shipment.service}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(shipment.trackingNumber); }}
                            className="p-1.5 rounded-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {isExpanded
                            ? <ChevronUp className="h-4 w-4 text-gray-400" />
                            : <ChevronDown className="h-4 w-4 text-gray-400" />}
                        </div>
                      </div>

                      {/* Expanded panel */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50 px-6 py-5 grid md:grid-cols-2 gap-6">
                          {/* Update status */}
                          <div className="bg-white border border-gray-200 rounded-sm p-4">
                            <h3 className="font-black text-sm text-gray-900 mb-3 flex items-center gap-2">
                              <Truck className="h-4 w-4 text-[#4D148C]" />
                              Update Status
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">New Status</label>
                                <select
                                  value={su.status}
                                  onChange={(e) => setStatusUpdates((p) => ({ ...p, [shipment.trackingNumber]: { ...su, status: e.target.value } }))}
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C]"
                                >
                                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Est. Delivery (optional)</label>
                                <input
                                  type="date"
                                  value={su.estimatedDelivery}
                                  onChange={(e) => setStatusUpdates((p) => ({ ...p, [shipment.trackingNumber]: { ...su, estimatedDelivery: e.target.value } }))}
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C]"
                                />
                              </div>
                              <button
                                onClick={() => handleStatusUpdate(shipment.trackingNumber)}
                                disabled={statusMutation.isPending}
                                className="w-full bg-[#4D148C] hover:bg-[#3a0f6f] text-white text-sm font-bold py-2 rounded-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                              >
                                {statusMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                Push Status Update
                              </button>
                            </div>
                          </div>

                          {/* Add tracking event */}
                          <div className="bg-white border border-gray-200 rounded-sm p-4">
                            <h3 className="font-black text-sm text-gray-900 mb-3 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[#FF6200]" />
                              Add Tracking Event
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Location</label>
                                <input
                                  value={ef.location}
                                  onChange={(e) => setNewEvents((p) => ({ ...p, [shipment.trackingNumber]: { ...ef, location: e.target.value } }))}
                                  placeholder="e.g. Lagos Hub, Nigeria"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Status Label</label>
                                <input
                                  value={ef.status}
                                  onChange={(e) => setNewEvents((p) => ({ ...p, [shipment.trackingNumber]: { ...ef, status: e.target.value } }))}
                                  placeholder="e.g. Arrived at Sort Facility"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Description</label>
                                <input
                                  value={ef.description}
                                  onChange={(e) => setNewEvents((p) => ({ ...p, [shipment.trackingNumber]: { ...ef, description: e.target.value } }))}
                                  placeholder="e.g. Package received at Lagos hub"
                                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                                />
                              </div>
                              <button
                                onClick={() => handleAddEvent(shipment.trackingNumber)}
                                disabled={eventMutation.isPending}
                                className="w-full bg-[#FF6200] hover:bg-[#e05600] text-white text-sm font-bold py-2 rounded-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                              >
                                {eventMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                Add Event
                              </button>
                            </div>
                          </div>

                          {/* Preview link */}
                          <div className="md:col-span-2">
                            <a
                              href={`/track?number=${shipment.trackingNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs text-[#4D148C] font-semibold hover:underline"
                            >
                              <Package className="h-3 w-3" />
                              View customer tracking page for {shipment.trackingNumber}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-[#FF6200] mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-700">Real-time updates:</strong> When you push a status change or add a tracking event here, customers tracking their shipment will see the update within 5 seconds automatically — no page refresh needed.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
