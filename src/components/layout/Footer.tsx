import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { useState } from "react";
import bayouLogo from "@/assets/bayou-logo.png";

/** Inline icons for X and Google */
const IconX = ({ className = "w-6 h-6 md:w-7 md:h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2H21l-6.73 7.7L22 22h-6.74l-4.35-5.66L5.9 22H3.14l7.2-8.23L2 2h6.79l4.03 5.37L18.24 2Zm-2.36 18h2.04L8.2 4H6.16l9.72 16Z"/>
  </svg>
);
const IconGoogle = ({ className = "w-6 h-6 md:w-7 md:h-7" }) => (
  <svg className={className} viewBox="0 0 533.5 544.3" fill="currentColor" aria-hidden="true">
    <path d="M533.5 278.4c0-18.6-1.7-36.4-5-53.6H272.1v101.4h147.1c-6.3 34.2-25 63.2-53.4 82.7v68h86.3c50.6-46.6 81.4-115.4 81.4-198.5z"/>
    <path d="M272.1 544.3c72.7 0 133.9-24.1 178.6-65.4l-86.3-68c-24 16.1-54.7 25.5-92.3 25.5-70.9 0-131-47.8-152.4-112.1h-89.7v70.4C73.9 490 166.3 544.3 272.1 544.3z"/>
    <path d="M119.7 324.3c-5.3-16-8.3-33.1-8.3-50.6s3-34.6 8.3-50.6v-70.4H30C10.8 187.3 0 231.7 0 273.7s10.8 86.4 30 121.1l89.7-70.5z"/>
    <path d="M272.1 107c39.6 0 75.2 13.6 103.1 40.3l77.4-77.4C405.5 25.8 344.8 0 272.1 0 166.3 0 73.9 54.3 30 152.6l89.7 70.4C141.1 154.8 201.2 107 272.1 107z"/>
  </svg>
);

const Footer = () => {
  const [copied, setCopied] = useState<"email" | "phone" | null>(null);

  const copy = async (text: string, which: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  return (
    <footer className="bg-white text-bayou-green py-12">
      <div className="container-custom">
        {/* Four even columns on desktop; stack on mobile */}
        <div className="grid gap-10 md:gap-12 md:grid-cols-4 items-start mb-10">
          {/* Brand: larger logo only */}
          <div className="flex items-center md:items-start">
            <img
              src={bayouLogo}
              alt="Bayou Hospitality logo"
              className="h-24 w-auto md:h-28 object-contain"
            />
          </div>

          {/* Our Restaurants */}
          <div>
            <h4 className="font-semibold text-bayou-dark-green mb-4 uppercase tracking-wide">
              Our Restaurants
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#restaurants"
                  className="hover:text-bayou-dark-green transition-transform underline-offset-4 hover:underline inline-block hover:scale-[1.03]"
                >
                  Voodoo Chicken
                </a>
              </li>
              <li>
                <a
                  href="#restaurants"
                  className="hover:text-bayou-dark-green transition-transform underline-offset-4 hover:underline inline-block hover:scale-[1.03]"
                >
                  Blue Bayou Oyster Bar &amp; Grill
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-bayou-dark-green mb-4 uppercase tracking-wide">
              Contact
            </h4>
            <div className="space-y-2 text-sm">
              <button
                type="button"
                onClick={() => copy("info@bayouhospitality.com", "email")}
                className="flex items-center space-x-2 group"
                aria-label="Copy email address"
              >
                <Mail className="w-4 h-4" />
                <span className="group-hover:underline underline-offset-4">
                  info@bayouhospitality.com
                </span>
                {copied === "email" && (
                  <span className="ml-2 text-xs text-[#7ba5a4]">Copied!</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => copy("(504) 555-BAYOU", "phone")}
                className="flex items-center space-x-2 group"
                aria-label="Copy phone number"
              >
                <Phone className="w-4 h-4" />
                <span className="group-hover:underline underline-offset-4">
                  (504) 555-BAYOU
                </span>
                {copied === "phone" && (
                  <span className="ml-2 text-xs text-[#7ba5a4]">Copied!</span>
                )}
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-bayou-dark-green mb-4 uppercase tracking-wide">
              Social Media
            </h4>
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-bayou-light-blue hover:text-bayou-dark-green transition-colors"
              >
                <Facebook className="w-6 h-6 md:w-7 md:h-7" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-bayou-light-blue hover:text-bayou-dark-green transition-colors"
              >
                <Instagram className="w-6 h-6 md:w-7 md:h-7" />
              </a>
              <a
                href="#"
                aria-label="X (Twitter)"
                className="text-bayou-light-blue hover:text-bayou-dark-green transition-colors"
              >
                <IconX />
              </a>
              <a
                href="#"
                aria-label="Google Business"
                className="text-bayou-light-blue hover:text-bayou-dark-green transition-colors"
              >
                <IconGoogle />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="border-t border-bayou-light-blue/20 pt-8 text-center text-sm text-bayou-light-blue">
          <p>&copy; 2024 Bayou Hospitality. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
