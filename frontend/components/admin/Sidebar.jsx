'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Upload, Tag, Inbox, Settings, LogOut, PlusCircle } from 'lucide-react';

const LINKS = [
  ['/admin', 'Dashboard', LayoutDashboard], ['/admin/products', 'Products', Package], ['/admin/products/new', 'Add Product', PlusCircle], ['/admin/import', 'Bulk Import', Upload], ['/admin/offers', 'Offers & Banner', Tag], ['/admin/enquiries', 'Enquiries', Inbox], ['/admin/settings', 'Settings', Settings],
];

export function Sidebar({ user }) {
  const path = usePathname();
  const router = useRouter();
  const logout = async () => { await fetch('/auth/logout', { method: 'POST' }); router.push('/'); router.refresh(); };
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start" data-testid="admin-sidebar">
      <div className="card p-3">
        <div className="mb-3 flex items-center gap-3 border-b border-line px-2 pb-3">
          {user.picture && <img src={user.picture} alt="" className="h-9 w-9 rounded-full" referrerPolicy="no-referrer" />}
          <div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-stone-500" data-testid="admin-user-email">{user.email}</p></div>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
          {LINKS.map(([href, label, Icon]) => <Link key={href} href={href} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${path === href ? 'bg-ink text-paper' : 'text-stone-700 hover:bg-cream'}`} data-testid={`admin-nav-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`}><Icon size={16} /> {label}</Link>)}
          <button onClick={logout} className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-500 hover:bg-cream" data-testid="admin-logout-button"><LogOut size={16} /> Logout</button>
        </nav>
      </div>
    </aside>
  );
}
