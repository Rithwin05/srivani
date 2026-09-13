import { getSessionUser, isAdminEmail } from '@/lib/auth';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { Sidebar } from '@/components/admin/Sidebar';

export const metadata = { title: 'Srivani Admin', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }) {
  const user = await getSessionUser();
  if (!user || !isAdminEmail(user.email)) return <AdminLogin deniedEmail={user?.email || ''} />;
  return (
    <div className="container-x grid gap-8 py-8 lg:grid-cols-[220px_1fr]" data-testid="admin-shell">
      <Sidebar user={user} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
