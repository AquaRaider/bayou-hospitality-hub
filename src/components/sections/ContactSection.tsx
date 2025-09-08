import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

/** Inline icons for X and Google (match size with lucide) */
const IconX = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2H21l-6.73 7.7L22 22h-6.74l-4.35-5.66L5.9 22H3.14l7.2-8.23L2 2h6.79l4.03 5.37L18.24 2Zm-2.36 18h2.04L8.2 4H6.16l9.72 16Z"/>
  </svg>
);
const IconGoogle = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 533.5 544.3" fill="currentColor" aria-hidden="true">
    <path d="M533.5 278.4c0-18.6-1.7-36.4-5-53.6H272.1v101.4h147.1c-6.3 34.2-25 63.2-53.4 82.7v68h86.3c50.6-46.6 81.4-115.4 81.4-198.5z"/>
    <path d="M272.1 544.3c72.7 0 133.9-24.1 178.6-65.4l-86.3-68c-24 16.1-54.7 25.5-92.3 25.5-70.9 0-131-47.8-152.4-112.1h-89.7v70.4C73.9 490 166.3 544.3 272.1 544.3z"/>
    <path d="M119.7 324.3c-5.3-16-8.3-33.1-8.3-50.6s3-34.6 8.3-50.6v-70.4H30C10.8 187.3 0 231.7 0 273.7s10.8 86.4 30 121.1l89.7-70.5z"/>
    <path d="M272.1 107c39.6 0 75.2 13.6 103.1 40.3l77.4-77.4C405.5 25.8 344.8 0 272.1 0 166.3 0 73.9 54.3 30 152.6l89.7 70.4C141.1 154.8 201.2 107 272.1 107z"/>
  </svg>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you as soon as possible." });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-bayou-dark-green mb-6">
            GET IN TOUCH
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our restaurants, catering, or private events? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-card border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold text-bayou-dark-green mb-6">
                SEND US A MESSAGE
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border-border bg-white text-[#4d5a3f] placeholder-[#4d5a3f]/60"
                  style={{ WebkitTextFillColor: "#4d5a3f" }}
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-border bg-white text-[#4d5a3f] placeholder-[#4d5a3f]/60"
                  style={{ WebkitTextFillColor: "#4d5a3f" }}
                />
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="min-h-[160px] border-border bg-white text-[#4d5a3f] placeholder-[#4d5a3f]/60"
                  style={{ WebkitTextFillColor: "#4d5a3f" }}
                />
                <div className="pt-2">
                  <Button type="submit" className="btn-hero w-full sm:w-auto">
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right column: Contact Info + Social Media */}
          <div className="space-y-8">
            {/* CONTACT INFORMATION */}
            <Card className="shadow-card border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-bold text-bayou-dark-green mb-6">
                  CONTACT INFORMATION
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-bayou-dark-green">Email</p>
                      <p className="text-[#4d5a3f]">info@bayouhospitality.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-bayou-dark-green">Phone</p>
                      <p className="text-[#4d5a3f]">(504) 555-BAYOU</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-bayou-dark-green">Location</p>
                      <p className="text-[#4d5a3f]">New Orleans, Louisiana</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SOCIAL MEDIA */}
            <Card className="shadow-card border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-bold text-bayou-dark-green mb-6">
                  SOCIAL MEDIA
                </h3>

                <div className="flex items-center gap-4">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center hover:bg-bayou-light-blue/80 transition-colors"
                  >
                    <Facebook className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center hover:bg-bayou-light-blue/80 transition-colors"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    aria-label="X (Twitter)"
                    className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center hover:bg-bayou-light-blue/80 transition-colors"
                  >
                    <IconX className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    aria-label="Google Business"
                    className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center hover:bg-bayou-light-blue/80 transition-colors"
                  >
                    <IconGoogle className="w-6 h-6 text-white" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
