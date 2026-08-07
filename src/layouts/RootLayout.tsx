import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { House, Lightbulb, MoonStar, ScanFace, UserRound, UsersRound } from 'lucide-react'

const primaryNavigation = [
  { path: '/', icon: House, label: '首页' },
  { path: '/inspiration', icon: Lightbulb, label: '灵感' },
  { path: '/discovery', icon: ScanFace, label: '认识自己' },
  { path: '/mysticism', icon: MoonStar, label: '玄学' },
  { path: '/settings', icon: UserRound, label: '我的' },
]

const isPathActive = (pathname: string, path: string) => {
  if (path === '/') return pathname === '/'
  if (path === '/discovery') return pathname.startsWith('/discovery') || pathname.startsWith('/people')
  if (path === '/settings') return pathname.startsWith('/settings') || pathname.startsWith('/charter')
  return pathname.startsWith(path)
}

export default function RootLayout() {
  const location = useLocation()

  return (
    <div className="app-shell min-h-dvh bg-bg-primary text-text-primary">
      <aside className="desktop-sidebar hidden lg:flex">
        <NavLink to="/" className="brand-lockup" aria-label="绯绯首页">
          <span className="brand-seal" aria-hidden="true">绯</span>
          <span>
            <strong>绯绯</strong>
            <small>个人工作室</small>
          </span>
        </NavLink>

        <nav className="mt-10 space-y-1" aria-label="主导航">
          {primaryNavigation.map((item) => {
            const active = isPathActive(location.pathname, item.path)
            return (
              <NavLink key={item.path} to={item.path} end={item.path === '/'} className={`primary-nav-link ${active ? 'is-active' : ''}`}>
                <item.icon size={17} strokeWidth={active ? 2 : 1.6} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="self-subnav">
          <span>认识自己的另一部分</span>
          <NavLink to="/people" className={location.pathname.startsWith('/people') ? 'is-active' : ''}>
            <UsersRound size={15} strokeWidth={1.6} />
            关系档案
          </NavLink>
        </div>

        <p className="sidebar-privacy">所有记录仅保存在你的设备中</p>
      </aside>

      <div className="app-main-frame relative min-h-dvh">
        <main className="pb-24 lg:pb-10">
          <Outlet />
        </main>
      </div>

      <nav className="mobile-navigation lg:hidden" aria-label="移动端主导航">
        {primaryNavigation.map((item) => {
          const active = isPathActive(location.pathname, item.path)
          return (
            <NavLink key={item.path} to={item.path} className={`mobile-nav-link ${active ? 'is-active' : ''}`}>
              <item.icon size={19} strokeWidth={active ? 2.1 : 1.5} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
