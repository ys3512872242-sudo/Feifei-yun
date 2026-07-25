import { Link } from 'react-router-dom'
import { Plus, Sparkles } from 'lucide-react'
import { useInspirationStore } from '../features/inspiration/store'
import { formatRelative } from '../shared/lib'

export default function HomePage() {
  const inspirations = useInspirationStore((s) => s.inspirations)
  const recentInspirations = inspirations.slice(0, 5)
  const cultivating = inspirations.filter((i) => i.status === 'cultivating')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-text-primary">你好呀</h1>
        <p className="text-text-secondary mt-1">今天有什么想记录的吗？</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link
          to="/inspiration/new"
          className="flex items-center gap-3 p-4 card-paper hover:border-primary-300 transition-colors"
        >
          <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center">
            <Plus size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">快速记录</p>
            <p className="text-xs text-text-muted">捕捉碎片想法</p>
          </div>
        </Link>

        <Link
          to="/mysticism"
          className="flex items-center gap-3 p-4 card-paper hover:border-secondary-300 transition-colors"
        >
          <div className="w-10 h-10 rounded-md bg-secondary-50 flex items-center justify-center">
            <Sparkles size={20} className="text-secondary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">今日运势</p>
            <p className="text-xs text-text-muted">看看今天的能量</p>
          </div>
        </Link>
      </div>

      {cultivating.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-sm font-semibold text-text-primary">培育中的灵感</h2>
            <Link to="/inspiration/cultivate" className="text-xs text-primary-600 font-tabular">查看全部</Link>
          </div>
          <div className="space-y-2">
            {cultivating.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                to={`/inspiration/${item.id}`}
                className="block p-3 card-paper hover:border-primary-300 transition-colors"
              >
                <p className="text-sm text-text-primary line-clamp-2">{item.content}</p>
                <p className="text-xs text-text-muted mt-1 font-tabular font-tabular">{formatRelative(item.createdAt)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-sm font-semibold text-text-primary">最近灵感</h2>
          <Link to="/inspiration" className="text-xs text-primary-600 font-tabular">查看全部</Link>
        </div>

        {recentInspirations.length === 0 ? (
          <div className="text-center py-12 card-paper border-dashed">
            <div className="text-4xl mb-3">💡</div>
            <p className="text-text-secondary text-sm mb-3">还没有灵感记录</p>
            <Link
              to="/inspiration/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              <Plus size={16} />
              记录第一条灵感
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentInspirations.map((item) => (
              <Link
                key={item.id}
                to={`/inspiration/${item.id}`}
                className="block p-3 card-paper hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">
                    {item.emotion === 'excited' ? '🤩' :
                     item.emotion === 'calm' ? '😌' :
                     item.emotion === 'anxious' ? '😰' :
                     item.emotion === 'curious' ? '🤔' :
                     item.emotion === 'inspired' ? '✨' : '💬'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full font-tabular">{tag}</span>
                      ))}
                      <span className="text-xs text-text-muted font-tabular font-tabular">{formatRelative(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-text-muted font-display italic">绯绯 · 诚实不谄媚，透明可追溯</p>
      </div>
    </div>
  )
}
