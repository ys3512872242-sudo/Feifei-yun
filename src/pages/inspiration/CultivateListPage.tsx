import { Link } from 'react-router-dom'
import { ArrowLeft, Sprout } from 'lucide-react'
import { useInspirationStore } from '../../features/inspiration/store'
import { formatRelative } from '../../shared/lib'

export default function CultivateListPage() {
  const inspirations = useInspirationStore((s) => s.inspirations)
  const cultivating = inspirations.filter((i) => i.status === 'cultivating')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/inspiration" className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">培育区</h1>
          <p className="text-xs text-text-muted">值得深挖的灵感 · {cultivating.length} 条</p>
        </div>
      </div>

      {cultivating.length === 0 ? (
        <div className="text-center py-16 card-paper border border-dashed border-primary-200">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-text-secondary mb-1">培育区是空的</p>
          <p className="text-xs text-text-muted">对灵感进行深化后，值得深挖的想法会出现在这里</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cultivating.map((item) => (
            <Link
              key={item.id}
              to={`/inspiration/${item.id}`}
              className="block p-4 card-paper border border-green-100 hover:border-primary-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <Sprout size={18} className="text-green-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary line-clamp-2">{item.content}</p>
                  {item.valueJudgment?.nextStep && (
                    <p className="text-xs text-green-600 mt-1.5">
                      💡 {item.valueJudgment.nextStep}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-text-muted ml-auto font-tabular">{formatRelative(item.createdAt)}</span>
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
