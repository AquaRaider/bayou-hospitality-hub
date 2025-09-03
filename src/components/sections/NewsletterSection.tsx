import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate newsletter signup
    setIsSubmitted(true);
    toast({
      title: "Welcome to our newsletter!",
      description: "You'll receive updates about our restaurants and special events.",
    });

    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section className="py-20 bg-gradient-hero text-white">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-elegant">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-bayou-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-bayou-charcoal" />
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">
                Stay Connected
              </h2>
              
              <p className="text-bayou-cream mb-8 text-lg">
                Be the first to know about new menu items, special events, 
                and exclusive offers from both our restaurants.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                    required
                  />
                  <Button 
                    type="submit"
                    className="btn-hero sm:w-auto"
                  >
                    Subscribe
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-center space-x-3 text-bayou-gold">
                  <Check className="w-6 h-6" />
                  <span className="text-lg font-semibold">Thank you for subscribing!</span>
                </div>
              )}

              <p className="text-sm text-white/70 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;