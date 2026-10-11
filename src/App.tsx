import { lazy, Suspense, useSyncExternalStore } from 'react'
import MenuApp from './app/App'

const AdminDashboard = lazy(() => import('./app/components/organisms/AdminDashboard'))

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}
const isAdminRoute = () => window.location.hash.startsWith('#/admin')

export default function App() {
  const admin = useSyncExternalStore(subscribe, isAdminRoute, () => false)
  if (!admin) return <MenuApp />
  return (
    <Suspense fallback={<div className="min-h-dvh bg-zinc-950" />}>
      <AdminDashboard />
    </Suspense>
  )
}
