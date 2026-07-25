import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit3, MessageCircle, Trash2, Lightbulb, Tag, Calendar, Link2, Sprout, Archive } from 'lucide-react'
import { useInspirationStore } from '../../features/inspiration/store'
import { formatDateTime } from '../../shared/lib'

const emotionEmoji: Record<string, string> = {
  excited: '🤩', calm: '😌', anxious: '😰', curious: '🤔',
  tired: '😴', inspired: '✨', neutral: '💬',
}

export default function InspirationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const inspiration = useInspirationStore((s) => s.getById(id!))
  const update = useInspirationStore((s) => s.update)
  const remove = useInspirationStore((s) => s.remove)

  if (!inspiration) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted">灵感不存在</p>
        <Link to="/inspiration" className="text-primary-600 text-sm mt-2 inline-block">返回列表</Link>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm('确定删除这条灵感吗？')) {
      remove(inspiration.id)
      navigate('/inspiration')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* 顶部 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <div className="flex gap-1">
          {inspiration.status !== 'deepening' && (
            <Link
              to={`/inspiration/${inspiration.id}/deepen`}
              className="p-2 rounded-xl hover:bg-primary-50 text-primary-500 transition-colors"
              title="开始深化"
            >
              <MessageCircle size={18} />
            </Link>
          )}
          <Link
            to={`/inspiration/new`}
            className="p-2 rounded-xl hover:bg-bg-secondary text-text-secondary transition-colors"
            title="编辑"
          >
            <Edit3 size={18} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* 状态标签 */}
      <div className="mb-4">
        {inspiration.status === 'cultivating' && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-600 rounded-full">
            <Sprout size={12} /> 培育中
          </span>
        )}
        {inspiration.status === 'archived' && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-50 text-gray-500 rounded-full">
            <Archive size={12} /> 存档
          </span>
        )}
        {inspiration.status === 'deepening' && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
            <MessageCircle size={12} /> 深化中
          </span>
        )}
      </div>

      {/* 内容 */}
      <div className="card-paper border border-primary-100 p-5 mb-4">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">{emotionEmoji[inspiration.emotion]}</span>
          <p className="text-base text-text-primary leading-relaxed whitespace-pre-wrap flex-1">
            {inspiration.content}
          </p>
        </div>
      </div>

      {/* 元信息 */}
      <div className="card-paper border border-primary-50 p-4 mb-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Lightbulb size={14} className="text-text-muted" />
          <span className="text-text-muted">类型</span>
          <span className="text-text-primary font-medium">
            {inspiration.inspirationType === 'creative' ? '创意点子' :
             inspiration.inspirationType === 'observation' ? '碎片观察' :
             inspiration.inspirationType === 'emotion' ? '情绪感受' :
             inspiration.inspirationType === 'knowledge' ? '知识碎片' : '模糊直觉'}
          </span>
        </div>

        {inspiration.tags.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <Tag size={14} className="text-text-muted mt-0.5" />
            <span className="text-text-muted">标签</span>
            <div className="flex gap-1.5 flex-wrap">
              {inspiration.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {inspiration.source && (
          <div className="flex items-center gap-2 text-sm">
            <Link2 size={14} className="text-text-muted" />
            <span className="text-text-muted">来源</span>
            <span className="text-text-primary">{inspiration.source}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-text-muted" />
          <span className="text-text-muted">记录于</span>
          <span className="text-text-primary">{formatDateTime(inspiration.createdAt)}</span>
        </div>
      </div>

      {/* 价值判断 */}
      {inspiration.valueJudgment && (
        <div className={`rounded-2xl border p-4 mb-4 ${ inspiration.valueJudgment.level === 'cultivate' ? 'bg-green-50/50 border-green-100' : inspiration.valueJudgment.level === 'incubate' ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50/50 border-gray-100' }`}>
          <p className="text-sm font-medium text-text-primary mb-2">
            {inspiration.valueJudgment.level === 'cultivate' ? '🌱 值得深挖' :
             inspiration.valueJudgment.level === 'incubate' ? '💤 先养着' :
             '🍃 只是个念头'}
          </p>
          <ul className="space-y-1">
            {inspiration.valueJudgment.reasons.map((r, i) => (
              <li key={i} className="text-xs text-text-secondary pl-4 relative before:content-['·'] before:absolute before:left-1.5">{r}</li>
            ))}
          </ul>
          {inspiration.valueJudgment.nextStep && (
            <p className="text-xs text-primary-600 mt-2 font-medium">
              💡 {inspiration.valueJudgment.nextStep}
            </p>
          )}
        </div>
      )}

      {/* 关联 */}
      {(inspiration.relatedInspirations?.length || 0) > 0 && (
        <div className="card-paper border border-primary-50 p-4 mb-4">
          <p className="text-sm font-medium text-text-primary mb-2">🔗 关联灵感</p>
          <div className="space-y-2">
            {inspiration.relatedInspirations?.map((rid) => {
              const related = useInspirationStore.getState().getById(rid)
              if (!related) return null
              return (
                <Link
                  key={rid}
                  to={`/inspiration/${rid}`}
                  className="block text-sm text-primary-600 hover:underline"
                >
                  {related.content.slice(0, 50)}...
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3">
        {inspiration.status !== 'cultivating' && inspiration.status !== 'archived' && (
          <button
            onClick={() => update(inspiration.id, {
              status: 'cultivating',
              valueJudgment: {
                level: 'cultivate',
                reasons: ['你手动标记为值得深挖'],
                judgedAt: Date.now(),
              }
            })}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
          >
            <Sprout size={16} />
            标记为培育
          </button>
        )}
        {inspiration.status === 'cultivating' && (
          <button
            onClick={() => update(inspiration.id, { status: 'archived' })}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Archive size={16} />
            移至存档
          </button>
        )}
        {inspiration.status !== 'deepening' && inspiration.status !== 'cultivating' && (
          <Link
            to={`/inspiration/${inspiration.id}/deepen`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors"
          >
            <MessageCircle size={16} />
            开始深化
          </Link>
        )}
      </div>
    </div>
  )
}
