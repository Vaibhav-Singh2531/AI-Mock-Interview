import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const LogOutButton: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate("/sign-in");
    } catch {
      setIsLoading(false);
      alert("Error logging out");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-gradient-to-br from-purple-800/10 to-gray-800/20 text-white px-4 py-2 rounded hover:from-purple-800/20 hover:to-gray-800/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogOutButton;
