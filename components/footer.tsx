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
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const Footer = ({
    logo = {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
        alt: "blocks for shadcn/ui",
        title: "QuickShift",
        url: "#",
    },
    tagline = "Connecting skilled drivers with opportunities since 2019.",
    menuItems = [
        {
            title: "Product",
            links: [
                { text: "Overview", url: "#" },
                { text: "Pricing", url: "#" },
                { text: "Marketplace", url: "#" },
                { text: "Features", url: "#" },
                { text: "Integrations", url: "#" },
            ],
        },
        {
            title: "Company",
            links: [
                { text: "About", url: "#" },
                { text: "Team", url: "#" },
                { text: "Blog", url: "#" },
                { text: "Careers", url: "#" },
                { text: "Contact", url: "#" },
            ],
        },
    ],
    copyright = "© 2024 QuickShift. All rights reserved.",
    bottomLinks = [
        { text: "Terms and Conditions", url: "#" },
        { text: "Privacy Policy", url: "#" },
    ],
}: FooterProps) => {
    return (
        <section className="py-20">
            <div className="container max-w-7xl mx-auto w-full px-6">
                <footer>
                    {/* Top Section */}
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        {/* Logo + Tagline */}
                        <div>
                            <a
                                href={logo.url}
                                className="flex items-center gap-3 mb-4 lg:mb-6"
                            >
                                <Image
                                    width={40}
                                    height={40}
                                    src={logo.src}
                                    alt={logo.alt}
                                    title={logo.title}
                                    className="h-12 w-12"
                                />
                                <span className="text-2xl font-bold">{logo.title}</span>
                            </a>
                            <p className="text-gray-300">{tagline}</p>
                        </div>

                        {/* Menu Sections */}
                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-semibold text-white">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3 text-gray-400">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="hover:text-primary transition-colors"
                                        >
                                            <a href={link.url}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-700 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
                        <p>{copyright}</p>
                        <ul className="flex gap-6">
                            {bottomLinks.map((link, linkIdx) => (
                                <li key={linkIdx} className="hover:text-primary underline">
                                    <a href={link.url}>{link.text}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export { Footer };
