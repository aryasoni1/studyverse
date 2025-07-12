#!/bin/bash

# SkillForge Setup Script
echo "🚀 Setting up SkillForge development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment variables
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual values"
else
    echo "✅ Environment file already exists"
fi

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p public/{images,icons}
mkdir -p src/assets/{images,icons,fonts}

# Setup Git hooks (if git is available)
if command -v git &> /dev/null; then
    echo "🔧 Setting up Git hooks..."
    # Add pre-commit hook for linting
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
npm run lint:check && npm run format:check
EOF
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks configured"
fi

echo "🎉 Setup complete! Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Run 'npm run storybook' to view component documentation"
echo "4. Run 'npm test' to run the test suite"