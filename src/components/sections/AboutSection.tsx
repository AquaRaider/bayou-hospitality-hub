import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Flavor",
      description: "Every dish is crafted with love and authentic New Orleans traditions."
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "We bring people together through exceptional dining experiences."
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Our commitment to quality ingredients and preparation is unwavering."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-6">
            Our Story
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground mb-6">
              Bayou Hospitality was born from a deep love for New Orleans' rich culinary heritage 
              and a passion for bringing people together through exceptional food and warm hospitality.
            </p>
            <p className="text-lg text-muted-foreground">
              Our restaurants each tell a unique story while sharing our commitment to authentic flavors, 
              quality ingredients, and the vibrant spirit that makes New Orleans dining unforgettable.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center card-hover bg-card shadow-card border-0">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;