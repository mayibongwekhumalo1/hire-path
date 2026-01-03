import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { KeyboardShortcutsProvider } from '@/components/providers/KeyboardShortcutsProvider';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log('Session in dashboard layout:', session);

  if (!session) {
    redirect('/login');
  }

  return (
    <KeyboardShortcutsProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={session.user} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </KeyboardShortcutsProvider>
  );
}