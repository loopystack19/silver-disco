'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';
import { ArrowRight, ShoppingCart, BookOpen, Briefcase, Users, Award, FileText, Home, MessageCircle, Mail } from 'lucide-react';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect logged-in users to their respective dashboards
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // @ts-ignore
      const role = session.user.role;
      if (role === 'farmer') {
        router.push('/dashboard/farmers/marketplace');
      } else if (role === 'student') {
        router.push('/dashboard/students');
      } else if (role === 'learner') {
        router.push('/dashboard/learners');
      } else if (role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/buyers');
      }
    }
  }, [session, status, router]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/landing/hero.jpg"
            alt="African farmers working in field"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Empowering Farmers, Learners,<br />and Job Seekers Across Africa
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
            UmojaHub connects people to opportunities that drive food security, education, and employment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/register')}
              className="group px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('farmers-hub')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg font-semibold rounded-lg transition-all border-2 border-white/50 flex items-center gap-2"
            >
              Explore Platform
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Farmers Section (Food Security Hub) */}
      <section id="farmers-hub" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/landing/farmers-section.jpg"
                  alt="African farmer with produce"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                Food Security Hub
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Farmers Hub
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sell your produce directly, access verified buyers, and grow your income through the UmojaHub Marketplace.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  'Direct access to verified buyers',
                  'Fair pricing with no middlemen',
                  'Secure payment systems',
                  'Real-time market insights'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/dashboard/farmers/marketplace')}
                className="group px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Visit Marketplace
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Learners Section (Education Hub) */}
      <section id="learners-hub" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                Education Hub
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Learners Hub
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Access free learning resources, track your progress, and earn certifications to strengthen your career path.
              </p>
            </div>

            {/* Roadmap-style Visual */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Image */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/landing/learners-section.jpg"
                  alt="Students learning together"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Learning Path Steps */}
              <div className="space-y-6">
                {[
                  {
                    number: '01',
                    title: 'Choose Your Path',
                    description: 'Select from agriculture, technology, business, or vocational skills'
                  },
                  {
                    number: '02',
                    title: 'Learn at Your Pace',
                    description: 'Access courses anytime, anywhere with mobile-friendly content'
                  },
                  {
                    number: '03',
                    title: 'Track Progress',
                    description: 'Monitor your learning journey with detailed analytics'
                  },
                  {
                    number: '04',
                    title: 'Earn Certificates',
                    description: 'Receive verified credentials to showcase your skills'
                  }
                ].map((step, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={() => router.push('/dashboard/learners')}
                className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Start Learning
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Students Section (Employment Hub) */}
      <section id="employment-hub" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header with Image */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Content */}
              <div>
                <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
                  Employment Hub
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Employment Hub
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Post your projects, gain real-world experience, or hire interns. UmojaHub bridges the gap between education and opportunity.
                </p>
                <button
                  onClick={() => router.push('/dashboard/students')}
                  className="group px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  Explore Jobs
                  <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Image */}
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/landing/students-section.jpg"
                  alt="Young professionals collaborating"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: 'Post Projects',
                  description: 'Employers can post micro-jobs, internships, and project opportunities for students and graduates.'
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: 'Find Internships',
                  description: 'Browse verified internship opportunities to gain real-world experience in your field.'
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: 'Upload CV for Review',
                  description: 'Get your CV professionally reviewed and optimized for better job opportunities.'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
                <span className="text-xl font-bold">UmojaHub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting Africa's farmers, learners, and job seekers to opportunities that transform lives.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => router.push('/')}
                    className="text-gray-400 hover:text-white transition flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('farmers-hub')}
                    className="text-gray-400 hover:text-white transition"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard/farmers/marketplace')}
                    className="text-gray-400 hover:text-white transition"
                  >
                    Marketplace
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard/students')}
                    className="text-gray-400 hover:text-white transition"
                  >
                    Jobs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard/learners')}
                    className="text-gray-400 hover:text-white transition"
                  >
                    Courses
                  </button>
                </li>
              </ul>
            </div>

            {/* For Users */}
            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => router.push('/dashboard/farmers/marketplace')}
                    className="text-gray-400 hover:text-white transition"
                  >
                    For Farmers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard/learners')}
                    className="text-gray-400 hover:text-white transition"
                  >
                    For Learners
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard/students')}
                    className="text-gray-400 hover:text-white transition"
                  >
                    For Job Seekers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard/buyers')}
                    className="text-gray-400 hover:text-white transition"
                  >
                    For Buyers
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2 text-gray-400">
                  <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>info@umojahub.africa</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <MessageCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>+254 700 000 000</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Home className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>Nairobi, Kenya</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">
              © 2025 UmojaHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
