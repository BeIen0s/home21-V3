import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      content: "Home21 has completely transformed how our team collaborates. The intuitive interface and powerful features have increased our productivity by 40%. It's simply the best platform we've ever used.",
      author: "Sarah Chen",
      role: "CTO",
      company: "TechFlow Inc.",
      avatar: "/api/placeholder/64/64",
      rating: 5
    },
    {
      content: "The migration to Home21 was seamless, and the customer support has been exceptional. Our development cycles are now 50% faster, and the team collaboration features are game-changing.",
      author: "Michael Rodriguez",
      role: "Engineering Manager", 
      company: "InnovateLab",
      avatar: "/api/placeholder/64/64",
      rating: 5
    },
    {
      content: "As a startup, we needed a platform that could scale with us. Home21 delivered beyond our expectations. The analytics and insights have been crucial for our growth strategy.",
      author: "Emily Johnson",
      role: "Founder & CEO",
      company: "StartupVision",
      avatar: "/api/placeholder/64/64",
      rating: 5
    },
    {
      content: "Security was our top concern when choosing a platform. Home21's enterprise-grade security features and compliance certifications gave us the confidence to make the switch.",
      author: "David Park",
      role: "CISO",
      company: "SecureGlobal",
      avatar: "/api/placeholder/64/64",
      rating: 5
    },
    {
      content: "The ROI has been incredible. Within 6 months, we've seen a 200% improvement in team efficiency. Home21 has become an essential part of our daily operations.",
      author: "Lisa Thompson",
      role: "Operations Director",
      company: "EfficiencyPro",
      avatar: "/api/placeholder/64/64",
      rating: 5
    },
    {
      content: "What impressed me most is how quickly our team adopted Home21. The learning curve was minimal, and the productivity gains were immediate. Highly recommended!",
      author: "James Wilson",
      role: "Product Manager",
      company: "AgileTeam",
      avatar: "/api/placeholder/64/64",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-secondary-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            What our customers say
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what leaders from various industries 
            have to say about their experience with Home21.
          </p>
          
          {/* Overall rating */}
          <div className="mt-8 flex justify-center items-center space-x-4">
            <div className="flex space-x-1">
              {renderStars(5)}
            </div>
            <span className="text-lg font-semibold text-secondary-900">4.9/5</span>
            <span className="text-secondary-600">based on 2,847 reviews</span>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-secondary-50 rounded-2xl p-8 border border-secondary-200 hover:shadow-lg transition-shadow duration-300 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-primary-200">
                <Quote className="h-8 w-8" />
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <p className="text-secondary-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-secondary-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-secondary-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-secondary-200">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              Ready to join thousands of satisfied customers?
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              Start your free trial today and experience the difference Home21 can make 
              for your team. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Start Free Trial
              </button>
              <button className="border border-secondary-300 text-secondary-700 font-semibold px-8 py-3 rounded-lg hover:bg-secondary-50 transition-colors">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
            <div className="text-sm text-secondary-600">Customer Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-sm text-secondary-600">Support Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
            <div className="text-sm text-secondary-600">Uptime Guarantee</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">30s</div>
            <div className="text-sm text-secondary-600">Average Setup Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};