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
      <div className="pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}