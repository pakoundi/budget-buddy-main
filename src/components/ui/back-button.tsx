import { Button } from "./button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BackButton({ to, className = "", children }: BackButtonProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Retour à la page précédente
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`items-center gap-1.5 px-3 py-5 text-sm font-medium transition-colors hover:bg-accent/50 ${className}`}
    >
      <ChevronLeft className="h-4 w-4" />
      {children || 'Retour'}
    </Button>
  );
}
