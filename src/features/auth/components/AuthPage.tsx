import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

type AuthMode = 'login' | 'signup';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-md">
          {/* Back to Home */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="p-0 h-auto">
              <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Auth Forms */}
          {mode === 'login' ? (
            <LoginForm onSwitchToSignup={() => setMode('signup')} />
          ) : (
            <SignupForm onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 space-y-8">
          {/* Hero Image Placeholder */}
          <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-2xl">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  {mode === 'login' ? 'Welcome Back' : 'Start Your Journey'}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  {mode === 'login' 
                    ? 'Continue your learning journey with SkillForge and unlock your potential.'
                    : 'Join thousands of learners who are transforming their careers with SkillForge.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6 max-w-md">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-background/50 backdrop-blur-sm border shadow-lg">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold">AI-Powered Learning</h4>
                <p className="text-sm text-muted-foreground">
                  Personalized recommendations and instant help
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-background/50 backdrop-blur-sm border shadow-lg">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold">Expert Roadmaps</h4>
                <p className="text-sm text-muted-foreground">
                  Structured paths from beginner to expert
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-background/50 backdrop-blur-sm border shadow-lg">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold">Community Support</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with peers and mentors worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Learners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Visual - Shows on smaller screens */}
      <div className="lg:hidden absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}