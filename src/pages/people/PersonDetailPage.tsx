import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Trash2, MessageCircle } from 'lucide-react'
import { usePeopleStore } from '../../features/people/store'
import { formatDate } from '../../shared/lib'
import type { RelationshipType } from '../../core/types'

const relationshipLabels: Record<RelationshipType, string> = {
  family: '家人', close_friend: '密友', friend: '朋友',
  classmate: '同学', teacher: '老师', colleague: '同事',
  acquaintance: '认识的人', other: '其他',
}

const intimacyStars = (level: number) => '⭐'.repeat(level) + '·'.repeat(5 - level)

const emotionEmoji: Record<string, string> = {
  excited: '🤩', calm: '😌', anxious: '😰', curious: '🤔',
  tired: '😴', inspired: '✨', neutral: '💬',
}

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const person = usePeopleStore((s) => s.getPerson(id!))
  const interactions = usePeopleStore((s) => s.getInteractionsByPerson(id!))
  const removePerson = usePeopleStore((s) => s.removePerson)

  if (!person) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted">联系人不存在</p>
        <Link to="/people" className="text-primary-600 text-sm mt-2 inline-block">返回列表</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* 顶部 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <div className="flex gap-1">
          <Link
            to={`/people/${person.id}/vent`}
            className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-xs font-medium hover:bg-orange-100 transition-colors"
          >
            <MessageCircle size={14} />
            吐槽
          </Link>
          <button
            onClick={() => { if (confirm('确定删除吗？')) { removePerson(person.id); navigate('/people') } }}
            className="p-2 rounded-xl hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* 人物信息卡 */}
      <div className="card-paper border border-primary-100 p-5 mb-6 text-center">
        <div className="text-5xl mb-3">{person.avatar}</div>
        <h2 className="text-xl font-semibold text-text-primary">{person.name}</h2>
        <p className="text-sm text-text-secondary mt-1">
          {relationshipLabels[person.relationship]} · {intimacyStars(person.intimacy)}
        </p>
        {person.tags.length > 0 && (
          <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
            {person.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        {person.notes && (
          <p className="text-sm text-text-secondary mt-3 bg-bg-secondary rounded-xl p-3">
            {person.notes}
          </p>
        )}
        {person.firstMet && (
          <p className="text-xs text-text-muted mt-2">初次认识：{person.firstMet}</p>
        )}
      </div>

      {/* 互动记录 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">
          📋 互动记录 ({interactions.length})
        </h3>
        <Link
          to={`/people/${person.id}/vent`}
          className="text-xs text-orange-500 flex items-center gap-1"
        >
          <MessageCircle size={12} /> 吐槽
        </Link>
      </div>

      {interactions.length === 0 ? (
        <div className="text-center py-8 card-paper border border-dashed border-primary-200">
          <p className="text-text-muted text-sm">还没有互动记录</p>
        </div>
      ) : (
        <div className="space-y-2">
          {interactions.map((interaction) => (
            <div
              key={interaction.id}
              className={`p-3 rounded-xl border ${ interaction.isVent ? 'bg-orange-50/50 border-orange-100' : 'bg-bg-card border-primary-50' }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{emotionEmoji[interaction.emotion]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">
                      {interaction.type === 'chat' ? '💬 聊天' :
                       interaction.type === 'meet' ? '🤝 见面' :
                       interaction.type === 'call' ? '📞 通话' :
                       interaction.type === 'online' ? '🌐 线上' : '📅 事件'}
                    </span>
                    {interaction.isVent && (
                      <span className="text-xs text-orange-500 font-medium">吐槽</span>
                    )}
                    <span className="text-xs text-text-muted ml-auto">{formatDate(interaction.date)}</span>
                  </div>
                  <p className="text-sm text-text-primary mt-1">{interaction.content}</p>
                  {interaction.ventDetail && (
                    <div className="mt-2 bg-bg-card/80 rounded-lg p-2">
                      <p className="text-xs text-text-secondary">
                        💢 触发：{interaction.ventDetail.trigger}
                      </p>
                      <p className="text-xs text-text-secondary">
                        💭 感受：{interaction.ventDetail.feeling}
                      </p>
                      {interaction.ventDetail.resolved && (
                        <p className="text-xs text-green-600 mt-1">✅ 已释怀</p>
                      )}
                      {interaction.ventDetail.reflection && (
                        <p className="text-xs text-text-muted mt-1 italic">
                          "{interaction.ventDetail.reflection}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
