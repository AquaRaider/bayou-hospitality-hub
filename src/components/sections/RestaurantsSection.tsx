import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, MapPin, Clock } from "lucide-react";
import voodooChickenImage from "@/assets/voodoo-chicken.jpg";
import blueBayouImage from "@/assets/blue-bayou.jpg";

const RestaurantsSection = () => {
  const restaurants = [
    {
      name: "Voodoo Chicken",
      image: voodooChickenImage,
      description: "Experience bold, authentic New Orleans flavors with our signature fried chicken, crafted with secret spices and served with Southern hospitality.",
      location: "French Quarter, New Orleans",
      hours: "11 AM - 10 PM Daily",
      website: "#",
      color: "bayou-red"
    },
    {
      name: "Blue Bayou Oyster Bar & Grill",
      image: blueBayouImage,
      description: "Fresh Gulf oysters and elevated Louisiana cuisine in an elegant setting. Perfect for special occasions and unforgettable dining experiences.",
      location: "Warehouse District, New Orleans", 
      hours: "4 PM - 11 PM Daily",
      website: "#",
      color: "bayou-deep-blue"
    }
  ];

  return (
    <section id="restaurants" className="py-20 bg-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-6">
            Our Restaurants
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Two distinct dining experiences, both rooted in New Orleans tradition 
            and committed to exceptional quality.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {restaurants.map((restaurant, index) => (
            <Card key={index} className="overflow-hidden card-hover bg-card shadow-elegant border-0">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={`${restaurant.name} restaurant interior and dining experience`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <CardContent className="p-8">
                <h3 className={`text-2xl font-serif font-bold text-${restaurant.color} mb-4`}>
                  {restaurant.name}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {restaurant.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-3 text-primary" />
                    {restaurant.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-3 text-primary" />
                    {restaurant.hours}
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantsSection;