'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  const allItems = showHome 
    ? [{ label: 'Ana Sayfa', href: '/', icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  return (
    <nav 
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground mb-6",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              )}
              
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="flex items-center gap-1 hover:text-foreground transition-colors duration-200 text-blue-600 hover:text-blue-800"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span 
                  className={cn(
                    "flex items-center gap-1",
                    isLast ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Hook to generate breadcrumb items based on pathname
export function useBreadcrumbs(pathname: string, customItems?: BreadcrumbItem[]): BreadcrumbItem[] {
  if (customItems) {
    return customItems;
  }

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Build breadcrumbs based on URL segments
  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    const segment = segments[i];
    
    // Generate label based on segment
    let label = segment;
    let href = currentPath;
    
    // Custom labels for known routes
    switch (segment) {
      case 'templates':
        label = 'Şablonlar';
        break;
      case 'admin':
        label = 'Yönetim';
        break;
      case 'pricing':
        label = 'Fiyatlandırma';
        break;
      case 'orders':
        label = 'Siparişler';
        break;
      case 'new':
        label = 'Yeni';
        break;
      case 'preview':
        label = 'Önizleme';
        break;
      default:
        // For dynamic segments (like template slugs), capitalize first letter
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
    }
    
    // Don't make the last item clickable
    const breadcrumbItem: BreadcrumbItem = { label };
    if (i !== segments.length - 1) {
      breadcrumbItem.href = href;
    }
    
    breadcrumbs.push(breadcrumbItem);
  }
  
  return breadcrumbs;
}