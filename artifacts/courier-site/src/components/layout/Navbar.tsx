import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { name: "Track", href: "/track" },
    { name: "Ship", href: "/schedule-pickup" },
    { name: "Manage", href: "/dashboard" },
    { name: "Learn", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full">
      {/* Top utility bar */}
      <div className="bg-[#4D148C] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <span className="hidden sm:block opacity-80">United States - English</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:1-800-463-3339" className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
              <Phone className="h-3 w-3" />
              <span className="hidden sm:inline">1.800.GoFedEx</span>
            </a>
            <Link href="/dashboard" className="opacity-80 hover:opacity-100 transition-opacity font-medium">Log In / Register</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* FedEx Logo */}
            <Link href="/" className="flex-shrink-0" data-testid="nav-logo">
              <div className="flex items-baseline select-none">
                <span className="text-[#4D148C] font-black text-3xl tracking-tighter leading-none">Fed</span>
                <span className="text-[#FF6200] font-black text-3xl tracking-tighter leading-none">Ex</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                  className={`px-4 py-2 text-sm font-semibold rounded transition-colors flex items-center gap-1 ${
                    location === link.href
                      ? "text-[#4D148C] bg-purple-50"
                      : "text-gray-700 hover:text-[#4D148C] hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                  {link.name === "Learn" && <ChevronDown className="h-3 w-3 opacity-60" />}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/track">
                <button
                  data-testid="nav-btn-track"
                  className="bg-[#FF6200] hover:bg-[#e05600] text-white text-sm font-bold px-5 py-2 rounded transition-colors"
                >
                  Track a Package
                </button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="nav-mobile-toggle"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-4 py-3 text-sm font-semibold border-b border-gray-100 ${
                  location === link.href ? "text-[#4D148C] bg-purple-50" : "text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="p-4">
              <Link href="/track" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full bg-[#FF6200] hover:bg-[#e05600] text-white text-sm font-bold px-5 py-3 rounded transition-colors">
                  Track a Package
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
