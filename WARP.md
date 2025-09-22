# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Home21-V3 is a SaaS platform project utilizing modern web technologies with Docker deployment, GitHub version control, and Netlify frontend hosting.

## Technology Stack

- **Framework**: Warp framework for SaaS development
- **Deployment**: Docker containerization
- **Version Control**: GitHub
- **Frontend Hosting**: Netlify
- **Platform**: Windows development environment with PowerShell

## Development Commands

### Initial Setup
```powershell
# Clone and setup (when repository has content)
git clone <repository-url>
cd Home21-V3
```

### Common Development Tasks
```powershell
# Install dependencies (when package.json exists)
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build

# Run tests
npm test
# or
yarn test

# Run single test file
npm test -- <test-file>
# or
yarn test <test-file>

# Lint code
npm run lint
# or
yarn lint

# Format code
npm run format
# or
yarn format
```

### Docker Commands
```powershell
# Build Docker image
docker build -t home21-v3 .

# Run container locally
docker run -p 3000:3000 home21-v3

# Docker Compose (when docker-compose.yml exists)
docker-compose up -d
docker-compose down
```

### Git Workflow
```powershell
# Create feature branch
git checkout -b feature/branch-name

# Add and commit changes
git add .
git commit -m "feat: descriptive commit message"

# Push to GitHub
git push origin feature/branch-name
```

## Architecture Guidelines

### Project Structure (Expected)
```
Home21-V3/
├── src/                  # Source code
│   ├── components/       # Reusable UI components
│   ├── pages/           # Application pages/routes
│   ├── services/        # Business logic and API calls
│   ├── utils/           # Helper functions and utilities
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
├── tests/               # Test files
├── docs/                # Documentation
├── docker/              # Docker configuration
├── .github/             # GitHub Actions workflows
├── Dockerfile           # Docker container definition
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

### Development Practices

- Use semantic commit messages (feat:, fix:, docs:, refactor:, test:, chore:)
- Create feature branches for new development
- Write tests for new functionality
- Use TypeScript for type safety
- Follow consistent code formatting
- Document complex business logic
- Keep components small and focused
- Implement proper error handling

### SaaS Platform Considerations

- Implement user authentication and authorization
- Design for multi-tenancy if applicable
- Plan for scalable database architecture
- Consider subscription and billing integration
- Implement proper logging and monitoring
- Design responsive UI for multiple device types
- Plan for API versioning and backward compatibility

### Deployment Strategy

- Frontend deployed to Netlify for optimal performance
- Backend services containerized with Docker
- Use environment variables for configuration
- Implement proper CI/CD pipelines via GitHub Actions
- Plan for staging and production environments

## Environment Variables

Create `.env.local` for development environment variables:
```
# API Configuration
API_BASE_URL=http://localhost:3000
API_KEY=your-development-api-key

# Database Configuration
DATABASE_URL=your-database-connection-string

# Authentication
AUTH_SECRET=your-auth-secret
JWT_SECRET=your-jwt-secret

# Third-party Services
STRIPE_SECRET_KEY=your-stripe-key
SENDGRID_API_KEY=your-sendgrid-key
```

## Notes for Future Development

- This is version 3 of the Home21 project, suggesting iterative improvement
- Focus on learning from previous versions and implementing better architecture
- Consider microservices architecture for better scalability
- Plan for internationalization and localization early
- Implement comprehensive testing strategy from the start
- Document API endpoints and data models thoroughly