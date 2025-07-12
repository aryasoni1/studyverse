# SkillForge Deployment Guide

## Overview

This guide covers deploying SkillForge to various platforms including Netlify, Vercel, and self-hosted solutions.

## Prerequisites

- Node.js 18+ installed
- Git repository set up
- Environment variables configured
- Supabase project set up

## Environment Variables

Before deploying, ensure you have the following environment variables:

```bash
# Application
VITE_APP_NAME=SkillForge
VITE_APP_URL=https://your-domain.com

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services (Optional)
VITE_OPENAI_API_KEY=your_openai_api_key

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

## Netlify Deployment

### Option 1: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Option 2: Git Integration

1. Connect your repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Deploy automatically on push to main branch

## Vercel Deployment

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Option 2: Git Integration

1. Connect your repository to Vercel
2. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables in Vercel dashboard

## Self-Hosted Deployment

### Using Docker

1. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create `nginx.conf`:
```nginx
events {}
http {
    include /etc/nginx/mime.types;
    
    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

3. Build and run:
```bash
docker build -t skillforge .
docker run -p 80:80 skillforge
```

### Using PM2

1. Install PM2:
```bash
npm install -g pm2
```

2. Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'skillforge',
    script: 'serve',
    args: '-s dist -l 3000',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

3. Deploy:
```bash
npm run build
pm2 start ecosystem.config.js
```

## Database Migration

### Supabase Migration

1. Set up Supabase project
2. Run database migrations:
```bash
supabase db push
```

3. Set up Row Level Security (RLS) policies
4. Configure authentication providers

## Domain Configuration

### Custom Domain Setup

1. Configure DNS records:
   - A record: `@` → your-server-ip
   - CNAME record: `www` → your-domain.com

2. Set up SSL certificate:
   - Use Let's Encrypt for free SSL
   - Configure automatic renewal

### CDN Configuration

1. Set up CloudFlare or similar CDN
2. Configure caching rules for static assets
3. Enable gzip compression
4. Set up security headers

## Monitoring and Analytics

### Error Monitoring

1. Set up Sentry for error tracking:
```bash
npm install @sentry/react
```

2. Configure in your app:
```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: 'production',
});
```

### Performance Monitoring

1. Set up Google Analytics
2. Configure Lighthouse CI for performance monitoring
3. Set up uptime monitoring

## Backup and Recovery

### Database Backup

1. Set up automated Supabase backups
2. Configure point-in-time recovery
3. Test backup restoration process

### Code Backup

1. Use Git for version control
2. Set up multiple remote repositories
3. Tag releases for easy rollback

## Security Considerations

1. Enable HTTPS only
2. Configure Content Security Policy (CSP)
3. Set up proper CORS headers
4. Use environment variables for secrets
5. Enable rate limiting
6. Regular security updates

## Performance Optimization

1. Enable gzip compression
2. Configure browser caching
3. Use CDN for static assets
4. Implement code splitting
5. Optimize images and fonts
6. Monitor Core Web Vitals

## Troubleshooting

### Common Issues

1. **Build failures**: Check Node.js version and dependencies
2. **Environment variables**: Ensure all required variables are set
3. **Database connection**: Verify Supabase configuration
4. **CORS errors**: Check API endpoints and domain configuration

### Logs and Debugging

1. Check build logs in deployment platform
2. Monitor application logs
3. Use browser developer tools
4. Set up proper error boundaries

## Maintenance

### Regular Tasks

1. Update dependencies monthly
2. Monitor performance metrics
3. Review and rotate API keys
4. Check for security updates
5. Test backup and recovery procedures

### Scaling Considerations

1. Monitor resource usage
2. Set up auto-scaling if needed
3. Consider database read replicas
4. Implement caching strategies
5. Use CDN for global distribution