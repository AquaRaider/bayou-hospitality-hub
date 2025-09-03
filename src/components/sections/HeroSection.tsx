import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Delicious New Orleans cuisine showcasing our restaurant quality"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 video-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="hero-title text-white mb-6 animate-fade-in-up">
            Welcome to
            <span className="text-bayou-gold block">Bayou Hospitality</span>
          </h1>
          
          <p className="hero-subtitle text-bayou-cream mb-8 animate-fade-in-up-delay">
            Discover authentic New Orleans dining experiences at our signature restaurants. 
            From the bold flavors of Voodoo Chicken to the fresh elegance of Blue Bayou Oyster Bar & Grill.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up-delay-2">
            <Button className="btn-hero">
              Explore Our Restaurants
            </Button>
            <Button className="btn-secondary">
              View Our Story
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="text-bayou-cream hover:text-bayou-gold transition-colors">
            <ArrowDown size={32} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;