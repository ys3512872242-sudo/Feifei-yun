import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, GitGraph, MessageCircle } from 'lucide-react'
import { usePeopleStore } from '../../features/people/store'
import type { RelationshipType } from '../../core/types'

const relationshipLabels: Record<RelationshipType, string> = {
  family: '家人', close_friend: '密友', friend: '朋友',
  classmate: '同学', teacher: '老师', colleague: '同事',
  acquaintance: '认识的人', other: '其他',
}

const relationshipEmoji: Record<RelationshipType, string> = {
  family: '👨‍👩‍👧', close_friend: '💛', friend: '🤝',
  classmate: '📚', teacher: '👩‍🏫', colleague: '💼',
  acquaintance: '👋', other: '🔗',
}

const intimacyStars = (level: number) => '⭐'.repeat(level) + '·'.repeat(5 - level)

export default function PeopleListPage() {
  const people = usePeopleStore((s) => s.people)
  const getVentCountByPerson = usePeopleStore((s) => s.getVentCountByPerson)
  const [search, setSearch] = useState('')

  const filtered = people.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) ||
           p.tags.some((t) => t.toLowerCase().includes(q)) ||
           relationshipLabels[p.relationship].includes(q)
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">人际关系</h1>
          <p className="text-sm text-text-muted">{people.length} 位联系人</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/people/graph"
            className="p-2.5 rounded-xl bg-bg-card border border-primary-100 text-text-secondary hover:text-primary-600 hover:border-primary-200 transition-all"
            title="关系图谱"
          >
            <GitGraph size={18} />
          </Link>
          <Link
            to="/people/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            <Plus size={16} />
            添加
          </Link>
        </div>
      </div>

      {/* 搜索 */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="搜索姓名、标签或关系..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-primary-100 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-50 transition-all"
        />
      </div>

      {/* 人物列表 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 card-paper border border-dashed border-primary-200">
          <div className="text-5xl mb-4">🧑‍🤝‍🧑</div>
          <p className="text-text-secondary mb-3">
            {search ? '没有匹配的联系人' : '还没有添加任何人'}
          </p>
          {!search && (
            <Link
              to="/people/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium"
            >
              <Plus size={16} />添加第一个联系人
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((person) => {
            const ventCount = getVentCountByPerson(person.id)
            return (
              <Link
                key={person.id}
                to={`/people/${person.id}`}
                className="block p-4 card-paper border border-primary-50 hover:border-primary-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{person.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-text-primary">{person.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
                        {relationshipEmoji[person.relationship]} {relationshipLabels[person.relationship]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-muted">
                        {intimacyStars(person.intimacy)}
                      </span>
                      {ventCount > 0 && (
                        <span className="text-xs text-orange-500 flex items-center gap-0.5">
                          <MessageCircle size={10} /> {ventCount}次吐槽
                        </span>
                      )}
                    </div>
                    {person.tags.length > 0 && (
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {person.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-secondary-50 text-secondary-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
