import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="text-2xl font-bold text-primary">UmojaHub</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-primary transition">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-primary transition">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary transition">
                Contact
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-primary hover:text-primary-700 transition">
                Login
              </button>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23007F4E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary-800 leading-tight">
              Connecting Africa's<br />
              <span className="text-primary">Farmers, Learners, and Innovators</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              UmojaHub empowers communities through access to education, employment, and food security by connecting farmers, students, and job seekers on one digital platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Get Started →
              </button>
              <button className="px-8 py-4 bg-white text-primary text-lg font-semibold rounded-lg border-2 border-primary hover:bg-primary-50 transition-all shadow-md">
                Explore Platform
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-600">Farmers Connected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5000+</div>
                <div className="text-sm text-gray-600">Students Learning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Jobs Posted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Feature Overview Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
              Three Powerful Hubs, One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to grow, earn, and thrive—all connected seamlessly
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Farmers Hub - Inspired by Agrikool */}
            <div className="group bg-gradient-to-br from-primary-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary-100">
              {/* Image Section */}
              <div className="relative h-48 bg-primary-100 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop"
                  alt="African farmer in field"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-semibold rounded-full shadow-md">
                    For Farmers
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Farmers Hub
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Sell your produce directly to buyers, get fair prices, and grow your farming business with verified marketplace access.
                </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Direct marketplace access</span>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Verified farmer badges</span>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Agricultural tips & support</span>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Real-time price tracking</span>
                </div>
              </div>

                <button className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                  Start Selling →
                </button>
              </div>
            </div>

            {/* Learners Hub - Inspired by Khan Academy */}
            <div className="group bg-gradient-to-br from-sky-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-sky-100">
              {/* Image Section */}
              <div className="relative h-48 bg-sky-100 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="African students learning together"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sky-700 text-xs font-semibold rounded-full shadow-md">
                    For Learners
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Learners Hub
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Access free learning materials, build job-ready skills, and earn verified certificates to boost your career prospects.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-sky mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Free online courses</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-sky mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Progress tracking dashboard</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-sky mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Verified certificates</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-sky mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Personalized learning paths</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-sky text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors">
                  Start Learning →
                </button>
              </div>
            </div>

            {/* Employment Hub - Inspired by Internshala */}
            <div className="group bg-gradient-to-br from-accent-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-accent-100">
              {/* Image Section */}
              <div className="relative h-48 bg-accent-100 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop"
                  alt="Young African professional working"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-terracotta-700 text-xs font-semibold rounded-full shadow-md">
                    For Job Seekers
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Employment Hub
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Find micro-jobs, internships, and full-time opportunities. Build your portfolio and connect with employers directly.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Micro-jobs & internships</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">AI-powered CV optimization</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Project collaboration</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Application tracking</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-terracotta text-white font-semibold rounded-lg hover:bg-terracotta-600 transition-colors">
                  Find Jobs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-primary">
              The Power of Integration
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              UmojaHub's key innovation is seamless integration. Education leads to
              employment, employment provides resources for food security, and
              proper nutrition enables learning—all in one platform.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="p-6 bg-primary-50 rounded-lg">
                <h4 className="font-bold text-primary mb-2">
                  🎓 Learn → Work
                </h4>
                <p className="text-sm text-gray-700">
                  Complete courses, earn certificates, and use them to apply for
                  jobs—all without leaving the platform.
                </p>
              </div>
              <div className="p-6 bg-sky-50 rounded-lg">
                <h4 className="font-bold text-sky mb-2">
                  🌱 Learn → Sell
                </h4>
                <p className="text-sm text-gray-700">
                  Complete agricultural courses to earn "Verified Farmer" badges
                  that boost marketplace credibility.
                </p>
              </div>
              <div className="p-6 bg-accent-50 rounded-lg">
                <h4 className="font-bold text-terracotta mb-2">
                  💻 Work → Impact
                </h4>
                <p className="text-sm text-gray-700">
                  Students collaborate on projects that benefit farmers and
                  communities, creating real-world value.
                </p>
              </div>
              <div className="p-6 bg-terracotta-50 rounded-lg">
                <h4 className="font-bold text-primary mb-2">
                  🔄 Full Circle
                </h4>
                <p className="text-sm text-gray-700">
                  Every action in one hub creates opportunities in another—building
                  a sustainable ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-sky text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Join UmojaHub?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're a student, farmer, or job seeker—UmojaHub is here to
            empower your journey.
          </p>
          <button className="btn-accent text-lg px-12 py-4 text-gray-900">
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-xl mb-4 text-accent">UmojaHub</h4>
              <p className="text-gray-400 text-sm">
                Connecting Africa's Learners, Workers, and Farmers for a better
                tomorrow.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Education Hub</li>
                <li>Employment Hub</li>
                <li>Food Security Hub</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Contact</h5>
              <p className="text-sm text-gray-400">
                Email: info@umojahub.africa
                <br />
                Location: Nairobi, Kenya
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 UmojaHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
