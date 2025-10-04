'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AdminNavLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Show loading bar at the top of the page
  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-200">
      <div className="h-full bg-gradient-to-r from-rose-500 to-purple-600 animate-pulse"
           style={{ width: '70%', transition: 'width 0.3s ease-in-out' }} />
    </div>
  );
}
