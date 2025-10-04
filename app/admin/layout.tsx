import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import AdminSidebar from './admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAccess = await isAdmin();

  if (!hasAccess) {
    redirect('/login?redirect=/admin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}