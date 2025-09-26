import Link from "next/link";
import Image from "next/image";

interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface FooterProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
}

const Footer = ({
    logo = {
        src: "/images/logo.png",
        alt: "Logo",
        title: "TransQuick",
        url: "/",
    },
    tagline = `Connecting skilled drivers with opportunities since 2025.`,
    menuItems = [
        {
            title: "Company",
            links: [
                { text: "Home", url: "/" },
                { text: "About", url: "/about" },
                { text: "Services", url: "/services" },
                { text: "Contact", url: "/contact" },
            ],
        },
    ],
    copyright = `© ${new Date().getFullYear()} QuickShift Logistics. All rights reserved.`,
}: FooterProps) => {
    return (
        <footer className="mt-16 border-t">
            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Brand */}
                <div className="space-y-4">
                    {/* Logo */}
                    <Link href={logo.url} className="flex items-center gap-2">
                        <Image height={200} width={100} src={logo.src} alt={logo.alt} className="h-8 w-8 object-contain" />
                        {logo.title && <span className="font-bold text-lg">{logo.title}</span>}
                    </Link>
                    {/* Tagline */}
                    <p className="text-sm text-muted-foreground">{tagline}</p>
                </div>

                {/* Company Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        {menuItems[ 0 ].links.map((link, linkIdx) => (
                            <li key={linkIdx}>
                                <a href={link.url} className="hover:text-primary transition-colors">
                                    {link.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Contact</h4>
                    <ul className="space-y-3 text-muted-foreground text-sm">
                        <li>904 W 30 1/2 St Austin, TX 78705<br />United States</li>
                        <li>Email: <a href="mailto:info@Transquick.us" className="hover:text-primary transition-colors">info@Transquick.us</a></li>
                        <li>Phone: <a href="tel:+12512615451" className="hover:text-primary transition-colors">+1 251-261-5451</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t py-4 text-center text-xs text-muted-foreground">
                {copyright}
            </div>
        </footer>
    );
};

export { Footer };
