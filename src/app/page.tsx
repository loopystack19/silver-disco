export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              UmojaHub
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-accent-100">
              Connecting Africa's Learners, Workers, and Farmers
            </p>
            <p className="text-lg mb-8 text-white/90">
              An integrated platform addressing hunger, unemployment, and lack of
              education across Africa. Empowering communities through education,
              employment, and food security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-accent text-lg px-8 py-4">
                Get Started
              </button>
              <button className="btn-outline border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Three Hubs Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            Our Three Integrated Hubs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Education Hub */}
            <div className="card text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-4 text-sky">Education Hub</h3>
              <p className="text-gray-600 mb-4">
                Access free online courses, vocational training, and educational
                resources to build job-ready skills.
              </p>
              <ul className="text-left text-sm text-gray-700 space-y-2">
                <li>✓ Digital Skills & Coding</li>
                <li>✓ Agribusiness Training</li>
                <li>✓ Financial Literacy</li>
                <li>✓ Verified Certificates</li>
              </ul>
            </div>

            {/* Employment Hub */}
            <div className="card text-center">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-2xl font-bold mb-4 text-sky">Employment Hub</h3>
              <p className="text-gray-600 mb-4">
                Find jobs, internships, and micro-jobs. Collaborate on projects
                and optimize your CV with AI.
              </p>
              <ul className="text-left text-sm text-gray-700 space-y-2">
                <li>✓ Job Board & Applications</li>
                <li>✓ Project Collaboration</li>
                <li>✓ CV Optimization (AI)</li>
                <li>✓ Micro-Jobs</li>
              </ul>
            </div>

            {/* Food Security Hub */}
            <div className="card text-center">
              <div className="text-5xl mb-4">🌾</div>
              <h3 className="text-2xl font-bold mb-4 text-sky">
                Food Security Hub
              </h3>
              <p className="text-gray-600 mb-4">
                Farmers sell produce directly to buyers. Get verified, access fair
                prices, and avoid middlemen.
              </p>
              <ul className="text-left text-sm text-gray-700 space-y-2">
                <li>✓ Farmer Marketplace</li>
                <li>✓ Verified Farmer Badges</li>
                <li>✓ Direct Buyer Contact</li>
                <li>✓ Agricultural Support</li>
              </ul>
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
