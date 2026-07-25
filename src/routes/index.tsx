import { Suspense, lazy } from 'react'
// 使用 HashRouter 兼容 GitHub Pages 静态托管（避免刷新子路由 404）
import { createHashRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'

// 懒加载所有页面
const HomePage = lazy(() => import('../pages/HomePage'))
const InspirationListPage = lazy(() => import('../pages/inspiration/InspirationListPage'))
const InspirationCreatePage = lazy(() => import('../pages/inspiration/InspirationCreatePage'))
const InspirationDetailPage = lazy(() => import('../pages/inspiration/InspirationDetailPage'))
const DeepeningChatPage = lazy(() => import('../pages/inspiration/DeepeningChatPage'))
const CultivateListPage = lazy(() => import('../pages/inspiration/CultivateListPage'))
const InspirationPoolPage = lazy(() => import('../pages/inspiration/InspirationPoolPage'))
const DiscoveryPage = lazy(() => import('../pages/discovery/DiscoveryPage'))
const PatternDetailPage = lazy(() => import('../pages/discovery/PatternDetailPage'))
const DailyFortunePage = lazy(() => import('../pages/mysticism/DailyFortunePage'))
const TarotPage = lazy(() => import('../pages/mysticism/TarotPage'))
const BaziPage = lazy(() => import('../pages/mysticism/BaziPage'))
const PeopleListPage = lazy(() => import('../pages/people/PeopleListPage'))
const PersonDetailPage = lazy(() => import('../pages/people/PersonDetailPage'))
const PersonCreatePage = lazy(() => import('../pages/people/PersonCreatePage'))
const VentPage = lazy(() => import('../pages/people/VentPage'))
const RelationshipGraphPage = lazy(() => import('../pages/people/RelationshipGraphPage'))
const CharterPage = lazy(() => import('../pages/charter/CharterPage'))
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'))
const CalibrationPage = lazy(() => import('../pages/settings/CalibrationPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
    </div>
  )
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
      // 灵感速记 + 深化
      { path: 'inspiration', element: <SuspenseWrapper><InspirationListPage /></SuspenseWrapper> },
      { path: 'inspiration/new', element: <SuspenseWrapper><InspirationCreatePage /></SuspenseWrapper> },
      { path: 'inspiration/:id', element: <SuspenseWrapper><InspirationDetailPage /></SuspenseWrapper> },
      { path: 'inspiration/:id/deepen', element: <SuspenseWrapper><DeepeningChatPage /></SuspenseWrapper> },
      { path: 'inspiration/cultivate', element: <SuspenseWrapper><CultivateListPage /></SuspenseWrapper> },
      { path: 'inspiration/pool', element: <SuspenseWrapper><InspirationPoolPage /></SuspenseWrapper> },
      // 自我发现
      { path: 'discovery', element: <SuspenseWrapper><DiscoveryPage /></SuspenseWrapper> },
      { path: 'discovery/pattern/:id', element: <SuspenseWrapper><PatternDetailPage /></SuspenseWrapper> },
      // 玄学
      { path: 'mysticism', element: <SuspenseWrapper><DailyFortunePage /></SuspenseWrapper> },
      { path: 'mysticism/tarot', element: <SuspenseWrapper><TarotPage /></SuspenseWrapper> },
      { path: 'mysticism/bazi', element: <SuspenseWrapper><BaziPage /></SuspenseWrapper> },
      // 人际关系
      { path: 'people', element: <SuspenseWrapper><PeopleListPage /></SuspenseWrapper> },
      { path: 'people/new', element: <SuspenseWrapper><PersonCreatePage /></SuspenseWrapper> },
      { path: 'people/:id', element: <SuspenseWrapper><PersonDetailPage /></SuspenseWrapper> },
      { path: 'people/:id/vent', element: <SuspenseWrapper><VentPage /></SuspenseWrapper> },
      { path: 'people/graph', element: <SuspenseWrapper><RelationshipGraphPage /></SuspenseWrapper> },
      // 宪章
      { path: 'charter', element: <SuspenseWrapper><CharterPage /></SuspenseWrapper> },
      // 设置
      { path: 'settings', element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
      { path: 'settings/calibration', element: <SuspenseWrapper><CalibrationPage /></SuspenseWrapper> },
      // 兜底
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
