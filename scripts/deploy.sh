#!/bin/bash

# SkillForge Deploy Script
echo "🚀 Deploying SkillForge..."

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  Warning: You're not on the main branch. Current branch: $CURRENT_BRANCH"
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Run build script
echo "🏗️  Running build script..."
./scripts/build.sh
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Deployment cancelled."
    exit 1
fi

# Deploy to Netlify (example)
if command -v netlify &> /dev/null; then
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod --dir=dist
    if [ $? -eq 0 ]; then
        echo "✅ Deployment to Netlify completed!"
    else
        echo "❌ Netlify deployment failed."
        exit 1
    fi
else
    echo "⚠️  Netlify CLI not found. Please install it or deploy manually."
    echo "Built files are in the 'dist' directory."
fi

echo "🎉 Deployment process completed!"