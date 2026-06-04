import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  const sections = [
    {
      title: "FedEx Services",
      links: [
        { label: "FedEx Express", href: "/services" },
        { label: "FedEx Ground", href: "/services" },
        { label: "FedEx Freight", href: "/services" },
        { label: "FedEx International", href: "/services" },
        { label: "FedEx Office", href: "/services" },
      ],
    },
    {
      title: "Shipping & Tracking",
      links: [
        { label: "Track a Package", href: "/track" },
        { label: "Schedule a Pickup", href: "/schedule-pickup" },
        { label: "Create a Shipment", href: "/dashboard" },
        { label: "Rates & Transit Times", href: "/pricing" },
        { label: "Delivery Options", href: "/services" },
      ],
    },
    {
      title: "Customer Support",
      links: [
        { label: "Contact FedEx", href: "/contact" },
        { label: "File a Claim", href: "/contact" },
        { label: "FAQs", href: "/contact" },
        { label: "Service Alerts", href: "/" },
        { label: "Feedback", href: "/contact" },
      ],
    },
    {
      title: "About FedEx",
      links: [
        { label: "Our Company", href: "/" },
        { label: "Investor Relations", href: "/" },
        { label: "Newsroom", href: "/" },
        { label: "Careers", href: "/" },
        { label: "Sustainability", href: "/" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social + legal */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[#4D148C] font-black text-2xl tracking-tighter">Fed</span>
            <span className="text-[#FF6200] font-black text-2xl tracking-tighter">Ex</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Federal Express Corporation. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Security & Fraud</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
