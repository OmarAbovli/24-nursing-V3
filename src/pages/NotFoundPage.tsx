
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="p-4 mb-6 rounded-full bg-destructive/10">
          <X className="w-12 h-12 text-destructive" />
        </div>
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="mb-8 text-xl">
          Oops! The page you're looking for cannot be found.
        </p>
        <Button asChild size="lg">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
