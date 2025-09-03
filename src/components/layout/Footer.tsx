import { Facebook, Instagram, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-bayou-charcoal text-bayou-cream py-12">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-bayou-charcoal font-bold text-xl">B</span>
              </div>
              <div>
                <div className="font-serif font-bold text-xl text-bayou-gold">
                  Bayou Hospitality
                </div>
                <div className="text-xs -mt-1">
                  New Orleans Dining
                </div>
              </div>
            </div>
            <p className="text-sm opacity-80">
              Bringing authentic New Orleans flavors and warm hospitality 
              to every dining experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-bayou-gold mb-4">Our Restaurants</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-bayou-gold transition-colors">
                  Voodoo Chicken
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-bayou-gold transition-colors">
                  Blue Bayou Oyster Bar & Grill
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-bayou-gold mb-4">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@bayouhospitality.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(504) 555-BAYOU</span>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <a href="#" className="text-bayou-cream hover:text-bayou-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-bayou-cream hover:text-bayou-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-bayou-cream/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; 2024 Bayou Hospitality. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;