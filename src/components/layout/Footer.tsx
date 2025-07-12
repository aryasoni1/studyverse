import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-xs font-bold">SF</span>
            </div>
            <span className="text-sm text-muted-foreground">
              © 2024 SkillForge. All rights reserved.
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="/support" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
            
            <a href="https://bolt.new" target="_blank" rel="noopener noreferrer">
              <img 
                src="/white_circle_360x360.png" 
                alt="Powered by Bolt.new" 
                className="h-8 w-8 dark:block hidden"
              />
              <img 
                src="/black_circle_360x360.png" 
                alt="Powered by Bolt.new" 
                className="h-8 w-8 dark:hidden block"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}