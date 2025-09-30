'use client';

import { Button } from "@/components/ui/button";

interface ScrollToFormButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function ScrollToFormButton({ className, size = "lg" }: ScrollToFormButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
      size={size}
    >
      Satın Al
    </Button>
  );
}