import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetDashboardStats, useGetRecentShipments, useListShipments, useCreateShipment, useGetShipment, useHealthCheck } from "@workspace/api-client-react";
import { Package, Clock, CheckCircle2, Truck, Plus, FileText, Settings, User, Eye, Activity } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const shipmentSchema = z.object({
  service: z.string().min(1, "Service is required"),
  origin: z.string().min(2, "Origin is required"),
  destination: z.string().min(2, "Destination is required"),
  weight: z.string().min(1, "Weight is required"),
  insured: z.boolean().optional()
});

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard | SwiftLink Logistics";
  }, []);

  const { toast } = useToast();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: recentShipments, isLoading: recentLoading } = useGetRecentShipments();
  const { data: allShipments, isLoading: allLoading, refetch: refetchAll } = useListShipments();
  const { data: healthData } = useHealthCheck();

  const createShipment = useCreateShipment();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewShipmentId, setViewShipmentId] = useState<number | null>(null);

  const { data: shipmentDetails, isLoading: shipmentLoading } = useGetShipment(
    viewShipmentId as number,
    { query: { enabled: !!viewShipmentId, queryKey: ['shipment', viewShipmentId] } }
  );

  const form = useForm<z.infer<typeof shipmentSchema>>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      service: "",
      origin: "",
      destination: "",
      weight: "",
      insured: false
    }
  });

  const onSubmitCreate = (data: z.infer<typeof shipmentSchema>) => {
    createShipment.mutate(
      { data },
      {
        onSuccess: () => {
          toast({ title: "Shipment created successfully" });
          setIsCreateOpen(false);
          form.reset();
          refetchAll();
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to create shipment" });
        }
      }
    );
  };

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen py-10 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back. Here is your shipping overview.</p>
              {healthData && (
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <Activity className="w-3 h-3 mr-1" /> API Status: {healthData.status}
                </p>
              )}
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link href="/schedule-pickup">
                <Button variant="outline" className="w-full md:w-auto">
                  <Clock className="mr-2 h-4 w-4" /> Schedule Pickup
                </Button>
              </Link>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 shadow-sm w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> New Shipment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Shipment</DialogTitle>
                    <DialogDescription>Enter the basic details to generate a shipping label.</DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Express Delivery">Express Delivery</SelectItem>
                                <SelectItem value="Standard Domestic">Standard Domestic</SelectItem>
                                <SelectItem value="International Air">International Air</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Origin</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco, CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <FormControl>
                              <Input placeholder="New York, NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (lbs)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={createShipment.isPending}>
                        {createShipment.isPending ? "Creating..." : "Create Shipment"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="shipments">All Shipments</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 animate-in fade-in-50">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-slate-500">Active Shipments</h3>
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Truck className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                      {statsLoading ? "..." : stats?.activeShipments || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-slate-500">Delivered (Month)</h3>
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                      {statsLoading ? "..." : stats?.deliveredThisMonth || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-slate-500">Pending Pickups</h3>
                      <div className="p-2 bg-orange-100 text-secondary rounded-lg">
                        <Clock className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                      {statsLoading ? "..." : stats?.pendingPickups || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-slate-500">Total Spent (YTD)</h3>
                      <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                      ${statsLoading ? "..." : (stats?.totalSpent || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Shipments */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-border bg-white px-6 py-5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Shipments</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {recentLoading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading shipments...</div>
                  ) : recentShipments && recentShipments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-border">
                          <tr>
                            <th className="px-6 py-4 font-medium">Tracking Number</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Destination</th>
                            <th className="px-6 py-4 font-medium">Service</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                          {recentShipments.map((shipment) => (
                            <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-mono font-medium text-slate-900">
                                {shipment.trackingNumber}
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                {format(new Date(shipment.createdAt), "MMM dd, yyyy")}
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                {shipment.destination}
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                {shipment.service}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                  shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {shipment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setViewShipmentId(shipment.id)} className="h-8 w-8 p-0 text-slate-600 hover:text-primary">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Link href={`/track?number=${shipment.trackingNumber}`}>
                                  <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary/80 hover:bg-primary/10">
                                    Track
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center flex flex-col items-center">
                      <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <Package className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-1">No shipments yet</h3>
                      <p className="text-slate-500 mb-6 max-w-sm mx-auto">You haven't created any shipments. Schedule a pickup to get started.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipments" className="animate-in fade-in-50">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-border bg-white px-6 py-5">
                  <CardTitle className="text-xl">All Shipments</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {allLoading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading shipments...</div>
                  ) : allShipments && allShipments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-border">
                          <tr>
                            <th className="px-6 py-4 font-medium">Tracking Number</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Origin</th>
                            <th className="px-6 py-4 font-medium">Destination</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                          {allShipments.map((shipment) => (
                            <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-mono font-medium text-slate-900">
                                {shipment.trackingNumber}
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                {format(new Date(shipment.createdAt), "MMM dd, yyyy")}
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                {shipment.origin}
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                {shipment.destination}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                  shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {shipment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setViewShipmentId(shipment.id)} className="h-8 w-8 p-0 text-slate-600 hover:text-primary">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Link href={`/track?number=${shipment.trackingNumber}`}>
                                  <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary/80 hover:bg-primary/10">
                                    Track
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      No shipments found.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="animate-in fade-in-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>Profile Details</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">Name</p>
                      <p className="font-medium text-slate-900">Acme Corporation</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">logistics@acmecorp.com</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">Account Type</p>
                      <p className="font-medium text-slate-900">Business Pro</p>
                    </div>
                    <Button variant="outline" className="mt-4">Edit Profile</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>Preferences</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Email Notifications</p>
                        <p className="text-sm text-slate-500">Receive updates on shipment status</p>
                      </div>
                      <div className="h-6 w-11 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">SMS Alerts</p>
                        <p className="text-sm text-slate-500">Get delivery confirmations via text</p>
                      </div>
                      <div className="h-6 w-11 bg-slate-200 rounded-full relative">
                        <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* View Shipment Dialog */}
          <Dialog open={!!viewShipmentId} onOpenChange={(open) => !open && setViewShipmentId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Shipment Details</DialogTitle>
              </DialogHeader>
              {shipmentLoading ? (
                <div className="p-6 text-center text-muted-foreground">Loading details...</div>
              ) : shipmentDetails ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-mono font-medium">{shipmentDetails.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{shipmentDetails.status}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Origin</p>
                      <p className="font-medium">{shipmentDetails.origin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">{shipmentDetails.destination}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p className="font-medium">{shipmentDetails.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cost</p>
                      <p className="font-medium">${shipmentDetails.cost?.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">Failed to load shipment details.</div>
              )}
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </Layout>
  );
}