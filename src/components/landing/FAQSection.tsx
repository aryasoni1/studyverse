import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What makes SkillForge different from other learning platforms?',
    answer: 'SkillForge combines AI-powered personalization, structured learning roadmaps, and community features in one platform. Our AI assistant provides instant help, while our community connects you with peers and mentors.',
  },
  {
    question: 'Is SkillForge suitable for beginners?',
    answer: 'Absolutely! Our platform is designed for learners at all levels. We offer beginner-friendly roadmaps, step-by-step guidance, and a supportive community to help you start your journey.',
  },
  {
    question: 'How does the AI assistant work?',
    answer: 'Our AI assistant uses advanced language models to understand your questions and provide personalized explanations, code examples, and learning recommendations based on your progress and goals.',
  },
  {
    question: 'Can I learn at my own pace?',
    answer: 'Yes! SkillForge is designed for flexible, self-paced learning. You can follow our structured roadmaps or create your own learning path based on your schedule and goals.',
  },
  {
    question: 'What kind of support is available?',
    answer: 'We offer multiple support channels including community forums, peer mentoring, expert Q&A sessions, and comprehensive documentation. Our team is also available for technical support.',
  },
  {
    question: 'Is there a free version available?',
    answer: 'Yes! We offer a free tier that includes access to basic features, community forums, and select learning content. Premium features are available with our paid plans.',
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked{' '}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about SkillForge and how it can help 
            accelerate your learning journey.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}