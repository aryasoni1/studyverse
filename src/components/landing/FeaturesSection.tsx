import {
  Brain,
  Users,
  Map,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Zap,
  Target,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description: 'Get personalized recommendations, instant explanations, and adaptive learning paths powered by advanced AI.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Map,
    title: 'Learning Roadmaps',
    description: 'Follow expertly crafted, step-by-step paths designed to take you from beginner to expert efficiently.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Users,
    title: 'Community Learning',
    description: 'Connect with peers, join study groups, find mentors, and learn together in our vibrant community.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: MessageSquare,
    title: 'Smart Notes',
    description: 'Take intelligent notes that automatically connect concepts, suggest related topics, and enhance retention.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: BookOpen,
    title: 'Focus Rooms',
    description: 'Immerse yourself in distraction-free virtual study spaces with ambient sounds and productivity tools.',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Track your growth with detailed insights, achievement milestones, and personalized performance metrics.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Zap,
    title: 'Quick Learning',
    description: 'Master concepts faster with bite-sized lessons, interactive exercises, and spaced repetition techniques.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Set personalized learning goals, track milestones, and stay motivated with achievement rewards.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Learn anywhere, anytime with offline support, mobile apps, and multi-language content.',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-primary/10 text-sm font-medium">
            <Zap className="h-4 w-4 text-primary" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Excel
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform provides all the tools, resources, and support you need 
            to achieve your learning goals and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-background/50 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className={`h-14 w-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Ready to experience the future of learning?</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <span>Start Your Journey Today</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
}