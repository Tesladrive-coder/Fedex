import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export default function Contact() {
  const { toast } = useToast();
  const submitContact = useSubmitContact();
  
  useEffect(() => {
    document.title = "Contact Us | SwiftLink Logistics";
  }, []);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    submitContact.mutate(
      { data },
      {
        onSuccess: (res) => {
          toast({
            title: "Message Sent",
            description: res.message || "We will get back to you shortly.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to send message. Please try again later.",
          });
        }
      }
    );
  };

  return (
    <Layout>
      <div className="bg-slate-900 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Our support team is available 24/7 to help with any questions about your shipments or our services.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            
            <Card className="border-none shadow-md bg-slate-50">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Headquarters</h4>
                  <p className="text-slate-600 leading-relaxed">
                    100 Logistics Way, Suite 400<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-slate-50">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Phone</h4>
                  <p className="text-slate-600 mb-1">Customer Service:<br /> 1-800-SWIFTLINK</p>
                  <p className="text-slate-600">Sales:<br /> 1-800-555-0199</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-slate-50">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Email</h4>
                  <p className="text-slate-600 mb-1">Support: support@swiftlink.com</p>
                  <p className="text-slate-600">Sales: sales@swiftlink.com</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg border-slate-100">
              <CardContent className="p-8 md:p-10">
                <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john@company.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="How can we help?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please provide details about your inquiry..." 
                              className="min-h-[150px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90 text-white h-12 text-base"
                      disabled={submitContact.isPending}
                    >
                      {submitContact.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}