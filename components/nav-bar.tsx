"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];

}

const Navbar = ({
    logo = {
        url: "/",
        src: "/images/partners.png",
        alt: "QuickShift Logo",
        title: "QuickShift",
    },
    menu = [
        { title: "Home", url: "/" },
        { title: "About", url: "about", },
        { title: "Services", url: "services", },
        { title: "Contact", url: "contact", },
    ],
}: NavbarProps) => {
    const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="backdrop-blur shadow-sm sticky top-0 z-50 border-b">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <a href={logo.url} className="flex items-center gap-2">
                        <span className="inline-block w-8 h-8 rounded-2xl bg-primary"></span>
                        <span className="text-2xl font-extrabold tracking-tight">
                            {logo.title}
                        </span>
                    </a>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex items-center gap-6 font-medium">
                        {menu.map((item) => (
                            <li key={item.title}>
                                <a href={item.url} className="hover:text-primary transition-colors">
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Toggle menu"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t bg-background/95 backdrop-blur">
                        <ul className="py-4 space-y-2">
                            {menu.map((item) => (
                                <li key={item.title}>
                                    <a
                                        href={item.url}
                                        className="block px-4 py-2 text-base font-medium hover:text-primary hover:bg-muted/50 transition-colors rounded-lg mx-2"
                                        onClick={closeMobileMenu}
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};


export { Navbar };
