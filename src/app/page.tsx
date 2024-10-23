"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  Code2,
  FileText,
  Rocket,
  Shield,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Rich Text Editor",
      description: "Write beautiful content with our powerful rich text editor.",
    },
    {
      icon: <Tag className="h-6 w-6" />,
      title: "Tag Organization",
      description: "Organize your posts with tags and categories.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaboration",
      description: "Work with team members and manage permissions.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Platform",
      description: "Your content is safe with our enterprise-grade security.",
    },
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Code Snippets",
      description: "Share code with syntax highlighting and formatting.",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Fast Performance",
      description: "Lightning-fast loading times and optimal performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/75 backdrop-blur-lg fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">SaucyBlog</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Create and Share Your Stories with{" "}
            <span className="text-primary">SaucyBlog</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The modern platform for writers, bloggers, and content creators.
            Start your journey today with our powerful and intuitive blogging platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                <Rocket className="h-5 w-5" />
                Start Writing
              </Button>
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Sparkles className="h-5 w-5" />
                    View Demo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming soon!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Create Amazing Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="rounded-lg p-3 bg-primary/10 w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Blogging Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of content creators who trust SaucyBlog for their writing needs.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="ml-2 font-semibold">SaucyBlog</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-600">
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <Link href="/features" className="hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-primary">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            © 2024 SaucyBlog. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}