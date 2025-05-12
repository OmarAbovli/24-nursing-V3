
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to role selection after a brief display of the logo
    const timer = setTimeout(() => {
      navigate("/role-selection");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="animate-pulse">
        <Logo size={120} />
      </div>
      <h1 className="mt-8 text-3xl font-bold">24h App</h1>
      <p className="mt-2 text-muted-foreground">Healthcare at your doorstep</p>
    </div>
  );
};

export default HomePage;
