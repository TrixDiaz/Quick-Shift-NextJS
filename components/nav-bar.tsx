import { Menu } from "lucide-react";

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
                    <button className="md:hidden p-2 rounded-lg hover:bg-muted" aria-label="Toggle menu">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};


export { Navbar };
