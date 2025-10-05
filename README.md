# UmojaHub - Integrated African Empowerment Platform

![UmojaHub Logo](public/images/logos/umojahub_logo.png)

**Connecting Africa's Learners, Workers, and Farmers**

An integrated web-based platform addressing three interconnected challenges facing Africa: hunger, unemployment, and lack of education through seamless integration of three core modules.

## 🌟 Core Innovation

UmojaHub's key innovation is **seamless integration** - recognizing that education leads to better employment, employment provides resources for food security, and proper nutrition enables learning. Users access all three services through a single platform with unified user accounts.

## 🎯 Three Core Hubs

### 📚 Education Hub
- Online courses and vocational training
- Digital skills, agribusiness, financial literacy
- Progress tracking and verified certificates
- Skill-based learning paths

### 💼 Employment Hub
- Job board (micro-jobs, internships, full-time)
- Project collaboration platform
- AI-powered CV optimization
- Application tracking system

### 🌾 Food Security Hub
- Direct farmer-to-buyer marketplace
- Farmer verification system
- Fair pricing and transparency
- Agricultural support resources

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/umojahub.git
   cd umojahub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual API keys.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
umojahub/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (main)/            # Public pages
│   │   ├── dashboard/         # Role-based dashboards
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── common/           # Shared components
│   │   ├── ui/               # Base UI elements
│   │   ├── farmers/          # Farmer-specific
│   │   ├── students/         # Student-specific
│   │   └── admin/            # Admin-specific
│   ├── lib/                   # Core utilities
│   │   ├── db.ts             # Database setup
│   │   ├── auth.ts           # Authentication
│   │   ├── utils.ts          # Helper functions
│   │   └── hooks/            # Custom React hooks
│   └── types/                 # TypeScript definitions
├── public/                    # Static assets
├── DEVELOPMENT_ROADMAP.md     # 12-week development plan
└── README.md                  # This file
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: LowDB (local), MongoDB Atlas (production)
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API
- **Image Storage**: Cloudinary
- **Email**: SendGrid/Mailgun
- **SMS**: Africa's Talking (future)

## 🎨 Design System

### Brand Colors

- **Primary (Deep Green)**: `#007F4E` - Growth, sustainability, agriculture
- **Accent (Warm Yellow)**: `#FFD166` - Hope, energy, opportunity
- **Terracotta**: `#D95D39` - Earth, resilience, community
- **Sky Blue**: `#3DB2FF` - Trust, clarity, education, innovation
- **Background**: `#F4F4F4` - Clean, minimalist

### Typography

- **Primary**: Poppins (headings, body)
- **Secondary**: Inter (body text)
- **Fallback**: sans-serif

## 📜 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🌍 Target Audience

- **Primary**: African youth and adults (18-35 years)
- **Countries**: Kenya, Nigeria, Ghana, South Africa
- **Access**: Mobile-first design for smartphones and desktop

## ✨ Key Features

### Integration Examples

1. **Learn → Work**: Complete courses → Earn certificates → Apply for jobs with verified credentials
2. **Learn → Sell**: Complete agricultural courses → Earn "Verified Farmer" badge → Boost marketplace credibility
3. **Work → Impact**: Students collaborate on projects → Build tools for farmers → Create community value

### Offline Capabilities

- PWA support with service workers
- Offline course viewing
- Local data persistence with IndexedDB
- Background synchronization
- Low-bandwidth optimization

## 🔐 Security & Privacy

- Password hashing with bcrypt
- JWT session management
- Role-based access control (RBAC)
- HTTPS/SSL encryption
- GDPR-inspired data privacy
- Farmer verification system
- Content moderation tools

## 📊 Success Metrics (MVP)

- 20 registered test users
- 15+ profile completions (75% rate)
- 10+ farmers with marketplace listings
- 10+ students enrolled in courses
- 5+ job applications submitted
- 3+ verified farmers
- 2+ students applying with certificates

## 🗺️ Roadmap

### Phase 1: MVP (Weeks 1-12)
- Core authentication and user management
- Three hub basic functionality
- Farmer verification system
- Course enrollment and certificates
- Job board and applications
- Marketplace listings

### Phase 2: Enhancement (Months 4-6)
- SMS notifications via Africa's Talking
- Farmer chatbot with AI
- WhatsApp Business API integration
- Advanced analytics
- User ratings and reviews

### Phase 3: Scale (Year 1+)
- Multi-language support (Swahili, French)
- Payment integration
- Mobile app (React Native/Flutter)
- Geographic expansion to 100+ cities

See [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for detailed week-by-week plan.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**UmojaHub Team**
- Email: info@umojahub.africa
- Location: Nairobi, Kenya
- Website: [https://umojahub.africa](https://umojahub.africa)

## 🙏 Acknowledgments

- All contributors and testers
- African farmers, students, and communities
- Open-source community
- Next.js and React teams

---

**Built with ❤️ for Africa by Africans**

*"Umoja" means Unity in Swahili - symbolizing our mission to unite learning, earning, and growing.*
