#!/bin/bash

# SkillForge Build Script
echo "🏗️  Building SkillForge for production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist

# Run linting
echo "🔍 Running linter..."
npm run lint:check
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix the issues and try again."
    exit 1
fi

# Run type checking
echo "🔍 Running type checks..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ Type checking failed. Please fix the issues and try again."
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test -- --run
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the issues and try again."
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed."
    exit 1
fi

# Build Storybook
echo "📚 Building Storybook..."
npm run build-storybook
if [ $? -ne 0 ]; then
    echo "⚠️  Storybook build failed, but continuing..."
fi

echo "✅ Build completed successfully!"
echo "📁 Built files are in the 'dist' directory"