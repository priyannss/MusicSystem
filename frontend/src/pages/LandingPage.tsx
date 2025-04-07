import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Music, HeadphonesIcon, Share2 } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold">MusiSync</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button>Log in</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Music, Your Way
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              Discover new music tailored to your taste with our AI-powered
              recommendation system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Features That Make Us Special
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Music className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  AI-Powered Recommendations
                </h3>
                <p className="text-muted-foreground">
                  Our smart algorithms learn from your listening habits to
                  suggest music you'll love.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <HeadphonesIcon className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Personalized Library
                </h3>
                <p className="text-muted-foreground">
                  Build your own collection with playlists, liked songs, and
                  listening history.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Social Sharing
                </h3>
                <p className="text-muted-foreground">
                  Share your favorite tracks and playlists with friends on social
                  media.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Music Experience?
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join thousands of music lovers who have discovered their new
              favorite songs with MusiSync.
            </p>
            <Link to="/login">
              <Button size="lg">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="p-8 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">MusiSync</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MusiSync. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
