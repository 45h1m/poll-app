import React from 'react';
// Optional: Import icons from react-icons or similar
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

// Define types for link sections (optional but good practice with TypeScript)
/*
interface FooterLink {
  href: string;
  label: string;
}

interface FooterLinkSection {
  title: string;
  links: FooterLink[];
}
*/

const Footer = ({ companyName = "Pollups" }) => {
    const currentYear = new Date().getFullYear();

    // Define link sections - customize these for your product
    const linkSections /*: FooterLinkSection[]*/ = [
        {
            title: 'Product',
            links: [
                { href: '/features', label: 'Features' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/integrations', label: 'Integrations' },
                { href: '/changelog', label: 'Changelog' },
            ],
        },
        {
            title: 'Company',
            links: [
                { href: '/about', label: 'About Us' },
                { href: '/careers', label: 'Careers' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
            ],
        },
        {
            title: 'Resources',
            links: [
                { href: '/docs', label: 'Documentation' },
                { href: '/support', label: 'Support Center' },
                { href: '/api-status', label: 'API Status' },
                { href: '/community', label: 'Community' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/cookies', label: 'Cookie Policy' },
                 { href: '/security', label: 'Security' },
            ],
        },
    ];

    // Define social links - replace '#' with actual URLs
    const socialLinks = [
        // { href: '#', label: 'Facebook', Icon: FaFacebook },
        // { href: '#', label: 'Twitter', Icon: FaTwitter },
        // { href: '#', label: 'Instagram', Icon: FaInstagram },
        // { href: '#', label: 'LinkedIn', Icon: FaLinkedin },
        // { href: '#', label: 'Github', Icon: FaGithub },
        { href: '#', label: 'Twitter', Icon: () => <>[X]</> }, // Placeholder example
        { href: '#', label: 'Github', Icon: () => <>[Github]</> },   // Placeholder example
        { href: '#', label: 'LinkedIn', Icon: () => <>[Linkedin]</> }, // Placeholder example
    ];


    return (
        <footer className="bg-gray-800 text-gray-300 pt-12 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top section: Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
                    {/* Optional Logo/Brand Column */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
                         {/* Replace with your actual logo if available */}
                         {/* <img src="/path/to/your/logo-white.svg" alt={`${companyName} Logo`} className="h-8 w-auto mb-4" /> */}
                         <h3 className="text-xl font-semibold text-white mb-2">{companyName}</h3>
                         <p className="text-sm text-gray-400">
                            Making things simpler, one product at a time. {/* Optional tagline */}
                         </p>
                    </div>

                    {/* Link Sections */}
                    {linkSections.map((section) => (
                        <div key={section.title}>
                            <h5 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-3">
                                {section.title}
                            </h5>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom section: Copyright and Social Links */}
                <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                        © {currentYear} {companyName}. All rights reserved.
                    </p>
                    <div className="flex space-x-5">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank" // Open social links in new tab
                                rel="noopener noreferrer" // Security best practice
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                                aria-label={social.label} // Accessibility
                            >
                                <social.Icon className="h-5 w-5" /> {/* Render the icon component */}
                                {/* Or use text if not using icons: {social.label} */}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;