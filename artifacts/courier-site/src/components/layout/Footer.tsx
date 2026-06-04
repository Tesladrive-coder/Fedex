import { Link } from "wouter";
import { Package, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group inline-flex">
              <div className="bg-secondary text-white p-2 rounded-lg">
                <Package className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                SwiftLink Logistics
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Premium logistics and courier solutions connecting businesses and individuals worldwide with speed and reliability.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-secondary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-secondary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-secondary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-secondary transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/track" className="hover:text-secondary transition-colors">Track Package</Link></li>
              <li><Link href="/services" className="hover:text-secondary transition-colors">Our Services</Link></li>
              <li><Link href="/pricing" className="hover:text-secondary transition-colors">Pricing & Rates</Link></li>
              <li><Link href="/schedule-pickup" className="hover:text-secondary transition-colors">Schedule Pickup</Link></li>
              <li><Link href="/dashboard" className="hover:text-secondary transition-colors">Customer Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Legal & Support</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-secondary transition-colors">FAQ & Help Center</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Prohibited Items</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-sm leading-tight">100 Logistics Way, Suite 400<br/>San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-sm">1-800-SWIFTLINK</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-sm">support@swiftlink.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SwiftLink Logistics. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <span>Built on Replit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}