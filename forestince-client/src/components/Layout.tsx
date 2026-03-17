import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { cn } from '../lib/utils'
import { Sidebar } from './Sidebar'

export type LayoutOutletContext = {
  onMenuClick: () => void
}

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-screen font-sans bg-screen text-color-fg text-sm">
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/45 z-40 lg:hidden"
        />
      )}

      <aside className="hidden lg:flex lg:flex-col w-52.5 bg-sidebar shrink-0">
        <Sidebar />
      </aside>

      <aside className={cn(
        'fixed top-0 left-0 bottom-0 w-55 bg-sidebar flex flex-col z-50 transition-transform duration-300 lg:hidden',
        drawerOpen
          ? 'translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.3)]'
          : '-translate-x-full'
      )}>
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Outlet context={{ onMenuClick: () => setDrawerOpen(true) } satisfies LayoutOutletContext} />
      </main>

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  )
}
