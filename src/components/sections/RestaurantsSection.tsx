// src/components/sections/RestaurantsSection.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, MapPin, ChevronDown } from "lucide-react";
import voodooChickenImage from "@/assets/voodoo-chicken.jpg";
import blueBayouImage from "@/assets/blue-bayou.jpg";

type Restaurant = {
  name: string;
  image: string;
  description: string;
  locationSummary: string;
  website: string;
  locations: string[];
};

const restaurants: Restaurant[] = [
  {
    name: "Voodoo Chicken",
    image: voodooChickenImage,
    description:
      "Experience bold, authentic New Orleans flavors with our signature fried chicken, crafted with secret spices and served with Southern hospitality.",
    locationSummary: "French Quarter, New Orleans",
    website: "https://voodoochickenanddaiquirisnola.com/",
    locations: [
      "629 Canal St, New Orleans, LA 70130",
      "838 Canal St, New Orleans, LA 70112",
      "730 St Louis St, New Orleans, LA 70130",
      "227 Bourbon St Suite C & D, New Orleans, LA 70130",
    ],
  },
  {
    name: "Blue Bayou Oyster Bar & Grill",
    image: blueBayouImage,
    description:
      "Fresh Gulf oysters and elevated Louisiana cuisine in an elegant setting. Perfect for special occasions and unforgettable dining experiences.",
    locationSummary: "Warehouse District, New Orleans",
    website: "https://bluebayourestaurantnola.com/",
    locations: ["717 Canal St, New Orleans, LA 70130"],
  },
];

export default function RestaurantsSection() {
  return (
    <section id="restaurants" className="py-20 bg-gradient-subtle">
      <div className="container-custom">
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-serif text-4xl font-bold text-[#4d5a3f] lg:text-5xl">
            Our Restaurants
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Two distinct dining experiences, both rooted in New Orleans tradition
            and committed to exceptional quality.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {restaurants.map((r) => (
            <Card
              key={r.name}
              className="card-hover overflow-hidden border-0 bg-card shadow-elegant"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={r.image}
                  alt={`${r.name} restaurant interior and dining experience`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <CardContent className="p-8">
                {/* Name — Dark Green */}
                <h3 className="mb-4 font-serif text-2xl font-bold text-[#4d5a3f]">
                  {r.name}
                </h3>

                <p className="mb-6 leading-relaxed text-muted-foreground">
                  {r.description}
                </p>

                {/* Location summary */}
                <div className="mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-3 h-4 w-4 text-[#8ba38c]" />
                    {r.locationSummary}
                  </div>
                </div>

                {/* View all locations (explicit brand colors; bullet “bubbles” fixed for mobile) */}
                <details className="group">
                  <summary
                    className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-[#8ba38c] outline-none transition-colors hover:text-[#4d5a3f]"
                    style={{ WebkitTextFillColor: "#8ba38c" }}
                  >
                    <ChevronDown
                      className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                    View all locations
                  </summary>

                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {r.locations.map((addr) => {
                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        addr
                      )}`;
                      return (
                        <li key={addr}>
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={[
                              // bubble container
                              "location-chip block rounded-lg border px-3 py-2 text-sm no-underline shadow-sm transition",
                              // colors: FORCE white bg + Dark Green text on all devices
                              "border-[#4d5a3f]/30 bg-white text-[#4d5a3f]",
                              // hover/focus
                              "hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ba38c]/40",
                            ].join(" ")}
                            // iOS Safari sometimes paints a UA color; this kills it
                            style={{ WebkitTextFillColor: "#4d5a3f" }}
                          >
                            <span className="flex items-start gap-2">
                              <MapPin className="mt-[2px] h-4 w-4 shrink-0 text-[#8ba38c]" />
                              <span className="leading-snug">
                                {addr}
                              </span>
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </details>

                {/* Website button */}
                <div className="mt-6">
                  <a href={r.website} target="_blank" rel="noopener noreferrer">
                    <Button className="btn-hero w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Website
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
