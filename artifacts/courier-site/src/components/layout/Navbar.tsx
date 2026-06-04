import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Package, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3 dark:bg-background/95"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-2 rounded-lg group-hover:bg-secondary transition-colors duration-300">
              <Package className="h-6 w-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isScrolled ? "text-foreground" : "text-foreground md:text-white"}`}>
              SwiftLink Logistics
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-secondary ${
                  location === link.href
                    ? "text-secondary font-semibold"
                    : isScrolled
                    ? "text-muted-foreground"
                    : "text-muted-foreground md:text-white/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/track">
              <Button data-testid="nav-btn-track" className="bg-secondary text-white hover:bg-secondary/90 border-0 rounded-full px-6 font-semibold shadow-md hover:shadow-lg transition-all">
                Track Package
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 ${isScrolled ? "text-foreground" : "text-foreground"}`}
              data-testid="nav-mobile-menu-btn"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-base font-medium p-2 rounded-md ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/track" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-secondary text-white hover:bg-secondary/90">
                Track Package
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}