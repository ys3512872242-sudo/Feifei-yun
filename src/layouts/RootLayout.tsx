import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Lightbulb, Compass, Users, Sparkles, User, FileText } from 'lucide-react'

const mobileTabs = [
  { path: '/inspiration', icon: Lightbulb, label: '灵感' },
  { path: '/discovery', icon: Compass, label: '发现' },
  { path: '/people', icon: Users, label: '关系' },
  { path: '/mysticism', icon: Sparkles, label: '运势' },
  { path: '/settings', icon: User, label: '我的' },
]

const desktopLinks = [
  { section: '核心', items: [
    { path: '/', icon: Sparkles, label: '仪表盘' },
  ]},
  { section: '创作', items: [
    { path: '/inspiration', icon: Lightbulb, label: '灵感速记' },
    { path: '/inspiration/cultivate', icon: Lightbulb, label: '培育区', indent: true },
    { path: '/inspiration/pool', icon: Lightbulb, label: '灵感池', indent: true },
  ]},
  { section: '探索', items: [
    { path: '/discovery', icon: Compass, label: '自我发现' },
    { path: '/people', icon: Users, label: '人际关系' },
    { path: '/mysticism', icon: Sparkles, label: '每日运势' },
    { path: '/mysticism/tarot', icon: Sparkles, label: '塔罗', indent: true },
    { path: '/mysticism/bazi', icon: Sparkles, label: '八字', indent: true },
  ]},
  { section: '工具', items: [
    { path: '/charter', icon: FileText, label: '原则宪章' },
    { path: '/settings', icon: User, label: '设置' },
  ]},
]

export default function RootLayout() {
  const location = useLocation()

  return (
    <div className="min-h-dvh bg-bg-primary">
      {/* 桌面侧边栏 */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-dvh w-60 bg-bg-card border-r border-[#ded5c2] z-30">
        <div className="p-5 border-b border-[#ded5c2]">
          <h1 className="font-display text-xl font-semibold text-text-primary">
            绯绯
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-tabular tracking-wide">你的个人工作室</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {desktopLinks.map((group) => (
            <div key={group.section} className="mb-4">
              <p className="px-3 mb-1.5 text-xs font-medium text-text-muted uppercase tracking-wider">
                {group.section}
              </p>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive: active }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all mb-0.5 border-l-2 ${
                      active
                        ? 'border-primary-500 bg-primary-50/60 text-primary-700 font-medium'
                        : 'border-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                    } ${item.indent ? 'pl-8' : ''}`
                  }
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#ded5c2]">
          <p className="text-xs text-text-muted text-center font-display italic">
            绯绯 · 诚实不谄媚，透明可追溯
          </p>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="lg:ml-60 min-h-dvh">
        <main className="pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* 移动端底部导航 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-card/95 backdrop-blur border-t border-[#ded5c2] z-30 safe-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileTabs.map((tab) => {
            // 特判：/inspiration 开头的都高亮灵感tab
            const active = tab.path === '/inspiration' 
              ? location.pathname.startsWith('/inspiration')
              : tab.path === '/settings'
              ? ['/settings', '/charter'].some(p => location.pathname.startsWith(p))
              : location.pathname.startsWith(tab.path) && (tab.path !== '/' || location.pathname === '/')
            
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                  active
                    ? 'text-primary-600'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <tab.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                <span className={`text-xs ${active ? 'font-medium' : ''}`}>{tab.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
