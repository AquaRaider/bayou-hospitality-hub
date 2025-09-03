import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-bayou-dark-green mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our restaurants, catering, or private events? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-card border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold text-bayou-dark-green mb-6">
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border-border"
                  />
                </div>
                
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-border"
                  />
                </div>
                
                <div>
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="min-h-[120px] border-border"
                  />
                </div>
                
                <Button type="submit" className="w-full btn-hero">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="shadow-card border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-bold text-bayou-dark-green mb-6">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-bayou-dark-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-bayou-dark-green">Email</p>
                      <p className="text-muted-foreground">info@bayouhospitality.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-bayou-dark-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-bayou-dark-green">Phone</p>
                      <p className="text-muted-foreground">(504) 555-BAYOU</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-bayou-dark-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-bayou-dark-green">Location</p>
                      <p className="text-muted-foreground">New Orleans, Louisiana</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-bold text-bayou-dark-green mb-6">
                  Follow Us
                </h3>
                
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center cursor-pointer hover:bg-bayou-light-blue/80 transition-colors">
                    <Facebook className="w-6 h-6 text-bayou-dark-green" />
                  </div>
                  <div className="w-12 h-12 bg-bayou-light-blue rounded-lg flex items-center justify-center cursor-pointer hover:bg-bayou-light-blue/80 transition-colors">
                    <Instagram className="w-6 h-6 text-bayou-dark-green" />
                  </div>
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