# Home21 V3 - Modern SaaS Platform

> A powerful, scalable SaaS platform built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

- **Modern Stack**: Built with Next.js 14, React 18, and TypeScript
- **Authentication**: Secure authentication with Auth0
- **Payment Processing**: Integrated with Stripe for subscription management
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Docker containers with CI/CD via GitHub Actions
- **Testing**: Comprehensive testing with Jest and React Testing Library
- **Development**: ESLint, Prettier, and TypeScript for code quality

## 🏗️ Architecture

```
Home21-V3/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Next.js pages and API routes
│   ├── services/        # Business logic and API calls
│   ├── utils/           # Helper functions and utilities
│   ├── types/           # TypeScript type definitions
│   └── styles/          # CSS and styling files
├── public/              # Static assets
├── tests/               # Test files
├── docs/                # Documentation
├── docker/              # Docker configuration
├── .github/             # GitHub Actions workflows
└── WARP.md              # Warp development guidelines
```

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (for development)
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Home21-V3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Docker Development

1. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   Navigate to `http://localhost:3000`

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Docker
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
npm run docker:up        # Start with docker-compose
npm run docker:down      # Stop docker-compose
```

## 🚀 Deployment

### Netlify (Frontend)

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Configure environment variables

### Docker (Full Stack)

1. **Build the image**
   ```bash
   docker build -t home21-v3 .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 home21-v3
   ```

### GitHub Actions

The project includes automated CI/CD workflows that:
- Run tests and linting on pull requests
- Build and push Docker images on main branch
- Deploy to staging/production environments

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret key
- `AUTH0_*` - Auth0 configuration
- `STRIPE_*` - Stripe API keys
- `SENDGRID_API_KEY` - Email service configuration

### Database Setup

1. **Install Prisma CLI**
   ```bash
   npm install -g prisma
   ```

2. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

3. **Run migrations**
   ```bash
   npx prisma db push
   ```

## 🧪 Testing

The project uses Jest and React Testing Library for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📚 Technology Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **React 18** - UI library with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend & Services
- **Auth0** - Authentication and authorization
- **Prisma** - Database ORM and query builder
- **Stripe** - Payment processing
- **SendGrid** - Email delivery service

### Development & Deployment
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Docker** - Containerization
- **GitHub Actions** - CI/CD automation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Write tests for new features and bug fixes
- Update documentation as needed
- Use semantic commit messages
- Ensure all CI checks pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🏆 Acknowledgements

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Authentication by [Auth0](https://auth0.com/)
- Payments by [Stripe](https://stripe.com/)

---

Made with ❤️ for modern SaaS development