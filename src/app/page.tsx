'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  BookOpen,
  Briefcase,
  Sprout,
  ShoppingCart,
  GraduationCap,
  CheckCircle,
  Star,
  Award,
  Users,
  TrendingUp,
  MapPin,
  Facebook,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  Clock,
  Shield
} from 'lucide-react';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect authenticated users to their dashboards
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // @ts-ignore
      const role = session.user.role;
      if (role === 'farmer') {
        router.push('/dashboard/farmers');
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

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
                UmojaHub
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-800 hover:text-emerald-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('education')}
                className={`font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-800 hover:text-emerald-600'
                }`}
              >
                Education
              </button>
              <button
                onClick={() => scrollToSection('employment')}
                className={`font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-800 hover:text-emerald-600'
                }`}
              >
                Employment
              </button>
              <button
                onClick={() => scrollToSection('farmers')}
                className={`font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-800 hover:text-emerald-600'
                }`}
              >
                Farmers
              </button>
              <button
                onClick={() => scrollToSection('buyers')}
                className={`font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-800 hover:text-emerald-600'
                }`}
              >
                Buyers
              </button>
              <button
                onClick={() => scrollToSection('lecturers')}
                className={`font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-800 hover:text-emerald-600'
                }`}
              >
                Lecturers
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2.5 font-semibold text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Register
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-emerald-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200 py-4 shadow-lg">
              <div className="flex flex-col space-y-4 px-4">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-left py-2 text-gray-700 hover:text-emerald-600 font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('education')}
                  className="text-left py-2 text-gray-700 hover:text-emerald-600 font-medium"
                >
                  Education
                </button>
                <button
                  onClick={() => scrollToSection('employment')}
                  className="text-left py-2 text-gray-700 hover:text-emerald-600 font-medium"
                >
                  Employment
                </button>
                <button
                  onClick={() => scrollToSection('farmers')}
                  className="text-left py-2 text-gray-700 hover:text-emerald-600 font-medium"
                >
                  Farmers
                </button>
                <button
                  onClick={() => scrollToSection('buyers')}
                  className="text-left py-2 text-gray-700 hover:text-emerald-600 font-medium"
                >
                  Buyers
                </button>
                <button
                  onClick={() => scrollToSection('lecturers')}
                  className="text-left py-2 text-gray-700 hover:text-emerald-600 font-medium"
                >
                  Lecturers
                </button>
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full px-6 py-3 text-gray-700 font-semibold border-2 border-gray-300 rounded-xl hover:border-emerald-500 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="order-2 lg:order-1">
              <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/landing/hero.jpg"
                  alt="UmojaHub Community"
                  fill
                  className="object-cover"
                  priority
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(e) => {
                    // Fallback to gradient background if image fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 hidden" />
              </div>
            </div>

            {/* Right: Text and CTAs */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Empowering Africa Through{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">
                    Knowledge, Innovation, and Opportunity
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  UmojaHub connects learners, farmers, and innovators for sustainable growth. Learn real skills, work on real projects, and build a better future.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection('education')}
                  className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('farmers')}
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-emerald-500 flex items-center justify-center gap-2 shadow-md"
                >
                  Explore UmojaHub
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">10,000+ Active Users</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">Verified Platform</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">Pan-African Reach</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Hub Section */}
      <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                <BookOpen className="w-4 h-4" />
                Education Hub
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Learn Real Skills from Real Sources
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Access global courses, track your progress, and earn certificates recognized by employers. Build the skills that matter for tomorrow's opportunities.
              </p>
              <button
                onClick={() => router.push('/learn')}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right: Image */}
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/education.jpg"
                alt="Education Hub"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 hidden" />
            </div>
          </div>

          {/* Course Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Agricultural Technology',
                provider: 'UmojaHub Academy',
                image: '/images/courses/agriculture.jpg',
                rating: 4.8,
                students: 1250
              },
              {
                title: 'Digital Marketing Fundamentals',
                provider: 'Business School',
                image: '/images/courses/marketing.jpg',
                rating: 4.9,
                students: 2100
              },
              {
                title: 'Data Science Essentials',
                provider: 'Tech Institute',
                image: '/images/courses/datascience.jpg',
                rating: 4.7,
                students: 1800
              }
            ].map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
                onClick={() => router.push('/learn')}
              >
                <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.provider}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">{course.students.toLocaleString()} students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employment Hub Section */}
      <section id="employment" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Image */}
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/employment.jpg"
                alt="Employment Hub"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 hidden" />
            </div>

            {/* Right: Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold text-sm">
                <Briefcase className="w-4 h-4" />
                Employment Hub
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold">
                Turn Knowledge into Experience
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Work on real projects, gain experience, and get reviewed by professionals. Build your portfolio while earning and connecting with top employers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/employment')}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  View Projects
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all shadow-lg"
                >
                  Apply as Student
                </button>
              </div>
            </div>
          </div>

          {/* Project Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Mobile App Development',
                field: 'Technology',
                deadline: '2 weeks',
                applicants: 24
              },
              {
                title: 'Content Writing for Agriculture',
                field: 'Communications',
                deadline: '1 week',
                applicants: 18
              },
              {
                title: 'Data Analysis & Reporting',
                field: 'Analytics',
                deadline: '3 weeks',
                applicants: 31
              }
            ].map((project, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-orange-500 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1"
                onClick={() => router.push('/employment')}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-white text-lg">{project.title}</h3>
                    <Briefcase className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Award className="w-4 h-4" />
                    <span>{project.field}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{project.deadline}</span>
                    </div>
                    <span className="text-sm font-semibold text-orange-500">{project.applicants} applicants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farmers Hub Section */}
      <section id="farmers" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Image */}
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/farmers.jpg"
                alt="Farmers Hub"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 hidden" />
            </div>

            {/* Right: Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-sm">
                <Sprout className="w-4 h-4" />
                Farmers Hub
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Empowering Farmers to Sell Directly
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Farmers can list, verify, and sell their produce straight to trusted buyers. Fair prices, instant payments, and no middlemen. Your harvest, your profit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/marketplace')}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Visit Marketplace
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-emerald-500 shadow-md"
                >
                  Register as Farmer
                </button>
              </div>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Fresh Maize',
                price: 'KSh 45/kg',
                farmer: 'John Kamau',
                verified: true,
                image: '/images/farming/maize.jpg'
              },
              {
                name: 'Organic Beans',
                price: 'KSh 120/kg',
                farmer: 'Mary Wanjiru',
                verified: true,
                image: '/images/farming/beans.jpg'
              },
              {
                name: 'Fresh Tomatoes',
                price: 'KSh 50/kg',
                farmer: 'Peter Ochieng',
                verified: true,
                image: '/images/farming/tomatoes.jpg'
              }
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
                onClick={() => router.push('/marketplace')}
              >
                <div className="relative w-full h-48 bg-gradient-to-br from-emerald-100 to-green-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                    {product.verified && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded-full">
                        <Shield className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700">Verified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">{product.price}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{product.farmer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyers Hub Section */}
      <section id="buyers" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-semibold text-sm">
                <ShoppingCart className="w-4 h-4" />
                Buyers Hub
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Buy Fresh, Buy Direct
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with verified farmers and access quality produce at fair prices. No middlemen, just fresh farm-to-table goodness delivered to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/marketplace')}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Browse Marketplace
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-amber-500 shadow-md"
                >
                  Login as Buyer
                </button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/buyers.jpg"
                alt="Buyers Hub"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 hidden" />
            </div>
          </div>

          {/* Product Preview Cards with Hover Zoom */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Cabbage', price: 'KSh 30/kg', image: '/images/farming/cabbage.jpg' },
              { name: 'Carrots', price: 'KSh 60/kg', image: '/images/farming/carrots.jpg' },
              { name: 'Kale', price: 'KSh 25/kg', image: '/images/farming/kales.jpg' },
              { name: 'Potatoes', price: 'KSh 40/kg', image: '/images/farming/potatoes.jpg' }
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
                onClick={() => router.push('/marketplace')}
              >
                <div className="relative w-full h-40 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-lg font-bold text-amber-600">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lecturers Section */}
      <section id="lecturers" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header - Center Aligned */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
              <GraduationCap className="w-4 h-4" />
              Lecturers & Mentors
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Guiding the Next Generation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Lecturers and mentors approve student projects, ensure quality learning, and shape future leaders. Your expertise transforms lives and builds tomorrow's workforce.
            </p>
          </div>

          {/* Image */}
          <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-16 max-w-5xl mx-auto">
            <Image
              src="/images/landing/lecturers.jpg"
              alt="Lecturers and Mentors"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 hidden" />
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { number: '+500', label: 'Students Mentored', icon: <Users className="w-8 h-8" /> },
              { number: '+300', label: 'Projects Approved', icon: <Award className="w-8 h-8" /> },
              { number: '+50', label: 'Partner Universities', icon: <TrendingUp className="w-8 h-8" /> }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center"
              >
                <div className="flex justify-center mb-4 text-purple-600">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/register')}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Join as Lecturer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/employment')}
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-purple-500 shadow-md"
            >
              View Student Projects
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
                <span className="text-2xl font-bold">UmojaHub</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting Africa's learners, farmers, and innovators for sustainable growth and opportunity.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('education')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Education
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('employment')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Employment
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('farmers')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Farmers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('buyers')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Buyers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('lecturers')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Lecturers
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-400">
                  <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>support@umojahub.org</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>+254 700 000 000</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Nairobi, Kenya</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 UmojaHub. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
