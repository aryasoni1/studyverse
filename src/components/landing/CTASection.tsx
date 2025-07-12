import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-primary/10 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Ready to get started?</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold">
              Your Learning Journey{' '}
              <span className="text-gradient">Starts Today</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of learners who are already transforming their careers 
              with SkillForge. Start your free account and begin learning immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="btn-gradient" asChild>
              <Link to="/auth/signup">
                Start Learning Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth/login">
                Sign In
              </Link>
            </Button>
          </div>

          <div className="pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Free forever • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}