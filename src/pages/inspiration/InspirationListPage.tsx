import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Lightbulb, Sprout, Archive } from 'lucide-react'
import { useInspirationStore } from '../../features/inspiration/store'
import { formatRelative } from '../../shared/lib'
import type { EmotionType } from '../../core/types'

const emotionEmoji: Record<EmotionType, string> = {
  excited: '🤩', calm: '😌', anxious: '😰', curious: '🤔',
  tired: '😴', inspired: '✨', neutral: '💬',
}

const statusFilters = [
  { key: 'all', label: '全部', icon: Lightbulb },
  { key: 'cultivating', label: '培育中', icon: Sprout },
  { key: 'archived', label: '存档', icon: Archive },
]

export default function InspirationListPage() {
  const inspirations = useInspirationStore((s) => s.inspirations)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [emotionFilter, setEmotionFilter] = useState<EmotionType | 'all'>('all')

  const filtered = inspirations.filter((i) => {
    if (search && !i.content.toLowerCase().includes(search.toLowerCase()) &&
        !i.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))) return false
    if (statusFilter !== 'all' && i.status !== statusFilter) return false
    if (emotionFilter !== 'all' && i.emotion !== emotionFilter) return false
    return true
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">灵感速记</h1>
          <p className="text-sm text-text-muted">{inspirations.length} 条记录</p>
        </div>
        <Link
          to="/inspiration/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          记录
        </Link>
      </div>

      {/* 搜索 */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="搜索灵感..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-primary-100 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-50 transition-all"
        />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {statusFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${ statusFilter === f.key ? 'bg-primary-100 text-primary-700' : 'bg-bg-card text-text-secondary border border-primary-100' }`}
          >
            <f.icon size={14} />
            {f.label}
          </button>
        ))}
        <div className="w-px bg-primary-100 mx-1" />
        {(['all', 'excited', 'calm', 'inspired', 'curious', 'anxious'] as const).map((e) => (
          <button
            key={e}
            onClick={() => setEmotionFilter(e)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${ emotionFilter === e ? 'bg-primary-100 text-primary-700' : 'bg-bg-card text-text-secondary border border-primary-100' }`}
          >
            {e === 'all' ? '全部情绪' : `${emotionEmoji[e]} ${e === 'excited' ? '兴奋' : e === 'calm' ? '平静' : e === 'inspired' ? '灵感' : e === 'curious' ? '好奇' : '焦虑'}`}
          </button>
        ))}
      </div>

      {/* 灵感列表 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 card-paper border border-dashed border-primary-200">
          <div className="text-5xl mb-4">💡</div>
          <p className="text-text-secondary mb-3">
            {search ? '没有匹配的灵感' : '还没有灵感记录'}
          </p>
          {!search && (
            <Link
              to="/inspiration/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium"
            >
              <Plus size={16} />记录第一条
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Link
              key={item.id}
              to={`/inspiration/${item.id}`}
              className="block p-4 card-paper border border-primary-50 hover:border-primary-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{emotionEmoji[item.emotion]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {item.status === 'cultivating' && (
                      <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">🌱 培育中</span>
                    )}
                    {item.status === 'archived' && (
                      <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full">存档</span>
                    )}
                    {item.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-text-muted ml-auto">
                      {formatRelative(item.createdAt)}
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
