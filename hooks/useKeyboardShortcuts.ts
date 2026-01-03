import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in an input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      // Check for Ctrl/Cmd key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'h':
            event.preventDefault();
            router.push('/dashboard/hires');
            break;
          case 't':
            event.preventDefault();
            router.push('/dashboard/tasks');
            break;
          case 'r':
            event.preventDefault();
            router.push('/dashboard/reports');
            break;
          case 'd':
            event.preventDefault();
            router.push('/dashboard');
            break;
          case 'n':
            event.preventDefault();
            // Navigate to new hire page (context-dependent)
            if (window.location.pathname.includes('/hires')) {
              router.push('/dashboard/hires/new');
            } else if (window.location.pathname.includes('/tasks')) {
              router.push('/dashboard/tasks/new');
            }
            break;
          case 'k':
            event.preventDefault();
            // Focus global search (if exists)
            const searchInput = document.querySelector('input[placeholder*="Search everything"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
        }
      }

      // Alt key shortcuts
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case '1':
            event.preventDefault();
            router.push('/dashboard');
            break;
          case '2':
            event.preventDefault();
            router.push('/dashboard/hires');
            break;
          case '3':
            event.preventDefault();
            router.push('/dashboard/tasks');
            break;
          case '4':
            event.preventDefault();
            router.push('/dashboard/reports');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);
}