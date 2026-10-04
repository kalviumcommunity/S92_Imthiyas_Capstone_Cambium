"use client";

import { Card } from "@/components/ui/card";

export function TestimonialsSection() {
  const testimonials = [
    { quote: "Cambium gives my research a place to live — not just a list of papers.", name: "Imthiyas", role: "Computer Vision Researcher", org: "MIT" },
    { quote: "The difference is that everything is connected to the work I'm actually doing.", name: "Arjun Rao", role: "PhD Researcher", org: "IISc" },
    { quote: "Finally, a research environment that understands how scholars actually work.", name: "Dr. Elena Park", role: "Computational Biology", org: "Stanford University" },
  ];

  return (
    <section className="bg-background border-t border-border py-20 lg:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-[44px] font-normal tracking-tight text-foreground">
            Built around the way research actually happens.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role, org }) => (
            <Card key={name} className="p-8 border-border">
              <div className="text-4xl font-serif text-primary leading-none mb-4">"</div>
              <p className="text-[17px] leading-[1.6] text-foreground mb-8">
                {quote}
              </p>
              <div>
                <div className="text-sm font-semibold text-foreground tracking-tight">{name}</div>
                <div className="text-[13px] text-muted-foreground mt-1">{role}</div>
                <div className="text-xs text-muted-foreground/70 mt-0.5">{org}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="4" fill="currentColor" className="text-primary" />
          </svg>
          <span className="font-bold text-sm tracking-tight text-foreground">CAMBIUM</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
        <div className="text-xs text-muted-foreground/70">
          © 2026 Cambium. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
