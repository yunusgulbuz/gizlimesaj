'use client';

import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface CustomTemplateRequestCtaProps {
  className?: string;
}

export default function CustomTemplateRequestCta({ className }: CustomTemplateRequestCtaProps) {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent('open-custom-template', {
        detail: { triggerRequest: true },
      }),
    );

    const section = document.getElementById('custom-template-request');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      className={className ?? 'h-12 gap-2 px-6 text-base'}
      onClick={handleClick}
    >
      Talep Formu
      <ArrowUpRight className="h-5 w-5" />
    </Button>
  );
}
