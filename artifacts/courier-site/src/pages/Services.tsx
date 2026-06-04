import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useListServices } from "@workspace/api-client-react";
import { Globe, Truck, Zap, Shield, Check, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  useEffect(() => {
    document.title = "Our Services | SwiftLink Logistics";
  }, []);

  const { data: services, isLoading } = useListServices();

  const getIconForCategory = (category: string) => {
    switch(category.toLowerCase()) {
      case 'express': return <Zap className="h-10 w-10 text-secondary" />;
      case 'international': return <Globe className="h-10 w-10 text-primary" />;
      case 'domestic': return <Truck className="h-10 w-10 text-primary" />;
      default: return <Shield className="h-10 w-10 text-primary" />;
    }
  };

  return (
    <Layout>
      <div className="bg-slate-900 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Delivery Services</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Comprehensive logistics solutions tailored to meet the demands of modern business and individual needs.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service) => (
              <Card key={service.id} className="flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-4 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                    {getIconForCategory(service.category)}
                  </div>
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <CardDescription className="text-base mt-2 h-12">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex justify-between items-end mb-6 pb-6 border-b border-border">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Starting from</p>
                      <p className="text-3xl font-bold">${service.priceFrom.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Delivery Time</p>
                      <p className="font-semibold text-primary">{service.deliveryTime}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <Check className="h-5 w-5 text-secondary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Link href="/schedule-pickup" className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90">Select Service</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}