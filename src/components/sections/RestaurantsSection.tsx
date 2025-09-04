// src/components/sections/RestaurantsSection.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ExternalLink, MapPin } from "lucide-react";
import voodooChickenImage from "@/assets/voodoo-chicken.jpg";
import blueBayouImage from "@/assets/blue-bayou.jpg";

type LocationEntry = { label?: string; address: string };

type Restaurant = {
  name: string;
  image: string;
  description: string;
  website: string;
  locations: LocationEntry[];
};

const RestaurantsSection = () => {
  const restaurants: Restaurant[] = [
    {
      name: "Voodoo Chicken",
      image: voodooChickenImage,
      description:
        "Experience bold, authentic New Orleans flavors with our signature fried chicken, crafted with secret spices and served with Southern hospitality.",
      website: "https://voodoochickenanddaiquirisnola.com/",
      locations: [
        { label: "Canal St (629)", address: "629 Canal St, New Orleans, LA 70130" },
        { label: "Canal St (838)", address: "838 Canal St, New Orleans, LA 70112" },
        { label: "St Louis St", address: "730 St Louis St, New Orleans, LA 70130" },
        { label: "Bourbon St (Suites C & D)", address: "227 Bourbon St Suite C & D, New Orleans, LA 70130" },
      ],
    },
    {
      name: "Blue Bayou Oyster Bar & Grill",
      image: blueBayouImage,
      description:
        "Fresh Gulf oysters and elevated Louisiana cuisine in an elegant setting. Perfect for special occasions and unforgettable dining experiences.",
      website: "https://bluebayourestaurantnola.com/",
      locations: [
        { label: "Canal St (717)", address: "717 Canal St, New Orleans, LA 70130" },
      ],
    },
  ];

  return (
    <section id="restaurants" className="py-20 bg-gradient-subtle">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-6">
            OUR RESTAURANTS
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Two distinct dining experiences, both rooted in New Orleans tradition
            and committed to exceptional quality.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {restaurants.map((restaurant, index) => (
            <Card
              key={index}
              className="overflow-hidden card-hover bg-card shadow-elegant border-0"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={`${restaurant.name} restaurant interior and dining experience`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <CardContent className="p-8">
                {/* Headings now Dark Green */}
                <h3 className="text-2xl font-serif font-bold text-bayou-dark-green mb-4">
                  {restaurant.name}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {restaurant.description}
                </p>

                {/* Uniform location dropdown; trigger text is Green */}
                <div className="mb-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="locations">
                      <AccordionTrigger className="text-sm text-bayou-green hover:underline">
                        {restaurant.locations.length > 1
                          ? `View all locations (${restaurant.locations.length})`
                          : "View location"}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3">
                          {restaurant.locations.map((loc, i) => (
                            <li
                              key={i}
                              className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background/50 p-3"
                            >
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                                <div className="text-sm text-muted-foreground">
                                  <div className="font-medium text-foreground">
                                    {loc.label ?? `Location ${i + 1}`}
                                  </div>
                                  <div>{loc.address}</div>
                                </div>
                              </div>

                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  loc.address
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium inline-flex items-center gap-1 hover:underline"
                                style={{ color: "hsl(var(--accent))" }}
                              >
                                <ExternalLink className="w-4 h-4" />
                                Directions
                              </a>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Website button opens in new tab */}
                <Button asChild className="w-full btn-hero">
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </a>
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
