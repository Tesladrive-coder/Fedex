import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSchedulePickup } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Truck } from "lucide-react";
import { useLocation } from "wouter";

const pickupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  phone: z.string().min(10, "Valid phone is required"),
  notes: z.string().optional()
});

export default function SchedulePickup() {
  const { toast } = useToast();
  const schedulePickup = useSchedulePickup();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    document.title = "Schedule Pickup | SwiftLink Logistics";
  }, []);

  const form = useForm<z.infer<typeof pickupSchema>>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      date: "",
      timeSlot: "",
      phone: "",
      notes: ""
    }
  });

  const onSubmit = (data: z.infer<typeof pickupSchema>) => {
    schedulePickup.mutate(
      { data },
      {
        onSuccess: (res) => {
          toast({
            title: "Pickup Scheduled!",
            description: `Confirmation Code: ${res.confirmationCode}. ${res.message}`,
          });
          setLocation("/dashboard");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to schedule pickup. Please try again.",
          });
        }
      }
    );
  };

  // Get tomorrow's date formatted for input[type="date"] min attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="mb-10 text-center">
          <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck className="h-10 w-10 text-secondary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">Schedule a Pickup</h1>
          <p className="text-lg text-muted-foreground">
            We'll come to your door. Fill out the details below to arrange a convenient pickup time.
          </p>
        </div>

        <Card className="shadow-xl border-slate-100">
          <CardHeader className="bg-slate-50 border-b border-border p-6 md:p-8">
            <CardTitle className="text-2xl">Pickup Details</CardTitle>
            <CardDescription className="text-base">Please ensure your packages are ready and properly labeled before the driver arrives.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name / Company</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Business Rd, Suite 100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City / Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco, 94107" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Date</FormLabel>
                        <FormControl>
                          <Input type="date" min={minDate} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time Slot</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time window" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (1:00 PM - 4:00 PM)</SelectItem>
                            <SelectItem value="evening">Evening (4:00 PM - 7:00 PM)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions for Driver (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="E.g., Ring doorbell at back entrance. Box is heavy." 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto px-10 bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold"
                    disabled={schedulePickup.isPending}
                  >
                    {schedulePickup.isPending ? "Scheduling..." : "Confirm Pickup"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}