
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-solo-bg text-solo-text">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="animate-float">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent mb-2">
            404
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-solo-accent to-solo-highlight mx-auto rounded-full mb-6"></div>
        </div>
        
        <p className="text-xl text-solo-text mb-2">Quest Not Found</p>
        <p className="text-solo-secondary mb-8">
          The path you seek is beyond your current level. Return to your main quest.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button asChild className="bg-solo-accent hover:bg-solo-highlight">
            <Link to="/" className="flex items-center justify-center">
              <Home className="mr-2 h-5 w-5" />
              Return to Main Quest
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-solo-accent/30 text-solo-accent hover:bg-solo-accent/10"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
