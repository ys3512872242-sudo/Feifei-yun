import { Link } from 'react-router-dom'
import { ArrowLeft, Archive } from 'lucide-react'
import { useInspirationStore } from '../../features/inspiration/store'
import { formatRelative } from '../../shared/lib'

export default function InspirationPoolPage() {
  const inspirations = useInspirationStore((s) => s.inspirations)
  // 灵感池：没有进入培育区也没有归档的
  const pool = inspirations.filter((i) => i.status === 'raw' || i.status === 'deepening')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/inspiration" className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">灵感池</h1>
          <p className="text-xs text-text-muted">先养着的想法 · {pool.length} 条</p>
        </div>
      </div>

      {pool.length === 0 ? (
        <div className="text-center py-16 card-paper border border-dashed border-primary-200">
          <div className="text-5xl mb-4">💤</div>
          <p className="text-text-secondary mb-1">灵感池是空的</p>
          <p className="text-xs text-text-muted">记录灵感后选择「先养着」，它们会在这里等你</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pool.map((item) => (
            <Link
              key={item.id}
              to={`/inspiration/${item.id}`}
              className="block p-4 card-paper border border-blue-100 hover:border-primary-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <Archive size={18} className="text-blue-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary line-clamp-2">{item.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-text-muted ml-auto font-tabular">{formatRelative(item.createdAt)}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-primary-500 hover:text-primary-600">
                      开始深化 →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
