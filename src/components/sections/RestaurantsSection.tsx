import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, MapPin, ChevronDown, Facebook, Instagram } from "lucide-react";
import voodooChickenImage from "@/assets/voodoo-chicken.jpg";
import blueBayouImage from "@/assets/blue-bayou.jpg";

/** Inline brand icons missing from lucide */
const IconX = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2H21l-6.73 7.7L22 22h-6.74l-4.35-5.66L5.9 22H3.14l7.2-8.23L2 2h6.79l4.03 5.37L18.24 2Zm-2.36 18h2.04L8.2 4H6.16l9.72 16Z"/>
  </svg>
);
const IconGoogle = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 533.5 544.3" fill="currentColor" aria-hidden="true">
    <path d="M533.5 278.4c0-18.6-1.7-36.4-5-53.6H272.1v101.4h147.1c-6.3 34.2-25 63.2-53.4 82.7v68h86.3c50.6-46.6 81.4-115.4 81.4-198.5z"/>
    <path d="M272.1 544.3c72.7 0 133.9-24.1 178.6-65.4l-86.3-68c-24 16.1-54.7 25.5-92.3 25.5-70.9 0-131-47.8-152.4-112.1h-89.7v70.4C73.9 490 166.3 544.3 272.1 544.3z"/>
    <path d="M119.7 324.3c-5.3-16-8.3-33.1-8.3-50.6s3-34.6 8.3-50.6v-70.4H30C10.8 187.3 0 231.7 0 273.7s10.8 86.4 30 121.1l89.7-70.5z"/>
    <path d="M272.1 107c39.6 0 75.2 13.6 103.1 40.3l77.4-77.4C405.5 25.8 344.8 0 272.1 0 166.3 0 73.9 54.3 30 152.6l89.7 70.4C141.1 154.8 201.2 107 272.1 107z"/>
  </svg>
);

type Restaurant = {
  name: string;
  image: string;
  description: string;
  locationSummary: string;
  website: string;
  locations: string[];
  socials?: { kind: "x" | "instagram" | "facebook" | "google"; href: string }[];
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
    socials: [
      { kind: "x", href: "https://x.com/VCDNola" },
      { kind: "instagram", href: "https://www.instagram.com/voodoochickenanddaiquiris/#" },
      {
        kind: "google",
        href: "https://www.google.com/search?sca_esv=6c97737eef5bcf41&sca_upv=1&q=Voodoo+Chicken+%26+Daiquiris&ludocid=5871745738521900036&lsig=AB86z5Ux8NlU5gZBKwjCilFzjf_Y&sa=X&ved=2ahUKEwjz5P_goY2HAxUwRfEDHR3JDA0QoAJ6BAgLEAc&biw=1920&bih=953#lrd=0x8620a7acf094bb81:0x517ca1a3ac02f404,1,,,,",
      },
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
    socials: [
      { kind: "facebook", href: "https://www.facebook.com/274775222394004" },
      { kind: "instagram", href: "https://www.instagram.com/bluebayourestaurantnola" },
      {
        kind: "google",
        href: "https://www.google.com/search?q=blue+bayou+restaurant+and+oyster+bar+reviews&oq=Blue+Bayou+Restaurant+and+Oyster+Bar+review&gs_lcrp=EgZjaHJvbWUqBwgAEAAYgAQyBwgAEAAYgAQyBggBEEUYOTIICAIQABgWGB4yCggDEAAYgAQYogSoAgCwAgE&sourceid=chrome&ie=UTF-8#lrd=0x8620a75388bb527b:0xc849efc5dcf24e6b,1,,,,",
      },
    ],
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
            <Card key={r.name} className="card-hover overflow-hidden border-0 bg-card shadow-elegant">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={r.image}
                  alt={`${r.name} restaurant interior and dining experience`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <CardContent className="p-8">
                {/* Name — Dark Green */}
                <h3 className="mb-4 font-serif text-2xl font-bold text-[#4d5a3f]">{r.name}</h3>

                <p className="mb-6 leading-relaxed text-muted-foreground">{r.description}</p>

                {/* Location summary + socials (icons only, right-aligned) */}
                <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-3 h-4 w-4 text-[#8ba38c]" />
                    {r.locationSummary}
                  </div>

                  {r.socials && r.socials.length > 0 && (
                    <div className="ml-auto flex items-center gap-3">
                      {r.socials.map((s) => {
                        const common =
                          "text-bayou-light-blue hover:text-bayou-dark-green transition-colors";
                        if (s.kind === "instagram")
                          return (
                            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${r.name} Instagram`} className={common}>
                              <Instagram className="h-5 w-5" />
                            </a>
                          );
                        if (s.kind === "facebook")
                          return (
                            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${r.name} Facebook`} className={common}>
                              <Facebook className="h-5 w-5" />
                            </a>
                          );
                        if (s.kind === "x")
                          return (
                            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${r.name} on X`} className={common}>
                              <IconX className="h-5 w-5" />
                            </a>
                          );
                        return (
                          <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${r.name} Google`} className={common}>
                            <IconGoogle className="h-5 w-5" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* View all locations */}
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
                              "location-chip block rounded-lg border px-3 py-2 text-sm no-underline shadow-sm transition",
                              "border-[#4d5a3f]/30 bg-white text-[#4d5a3f]",
                              "hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ba38c]/40",
                            ].join(" ")}
                            style={{ WebkitTextFillColor: "#4d5a3f" }}
                          >
                            <span className="flex items-start gap-2">
                              <MapPin className="mt-[2px] h-4 w-4 shrink-0 text-[#8ba38c]" />
                              <span className="leading-snug">{addr}</span>
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
