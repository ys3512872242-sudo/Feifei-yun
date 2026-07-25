import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { usePeopleStore } from '../../features/people/store'
import type { RelationshipType } from '../../core/types'

const relationshipOptions: { value: RelationshipType; label: string; emoji: string }[] = [
  { value: 'family', label: '家人', emoji: '👨‍👩‍👧' },
  { value: 'close_friend', label: '密友', emoji: '💛' },
  { value: 'friend', label: '朋友', emoji: '🤝' },
  { value: 'classmate', label: '同学', emoji: '📚' },
  { value: 'teacher', label: '老师', emoji: '👩‍🏫' },
  { value: 'colleague', label: '同事', emoji: '💼' },
  { value: 'acquaintance', label: '认识的人', emoji: '👋' },
  { value: 'other', label: '其他', emoji: '🔗' },
]

const avatarOptions = ['😊', '😎', '🤗', '🫶', '💪', '🌟', '🎯', '🔥', '🌸', '🍀', '🎨', '📚', '🎵', '🌈', '🦋', '🐣']

export default function PersonCreatePage() {
  const navigate = useNavigate()
  const addPerson = usePeopleStore((s) => s.addPerson)

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('😊')
  const [relationship, setRelationship] = useState<RelationshipType>('friend')
  const [intimacy, setIntimacy] = useState(3)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [firstMet, setFirstMet] = useState('')
  const [notes, setNotes] = useState('')

  const handleAddTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
      setTagInput('')
    }
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    const person = addPerson({
      name: name.trim(),
      avatar,
      relationship,
      tags,
      intimacy,
      firstMet: firstMet.trim() || undefined,
      notes: notes.trim(),
    })
    navigate(`/people/${person.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">添加联系人</h1>
        <div className="w-8" />
      </div>

      {/* 头像选择 */}
      <div className="card-paper border border-primary-100 p-4 mb-4">
        <p className="text-xs font-medium text-text-muted mb-3">选择头像</p>
        <div className="grid grid-cols-8 gap-2">
          {avatarOptions.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`text-2xl p-1.5 rounded-xl transition-all ${ avatar === a ? 'bg-primary-100 ring-2 ring-primary-300' : 'hover:bg-bg-secondary' }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* 姓名 */}
      <div className="card-paper border border-primary-100 p-4 mb-4">
        <label className="text-xs font-medium text-text-muted mb-2 block">姓名/昵称</label>
        <input
          type="text"
          placeholder="可以是真名、昵称或代号"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {/* 关系类型 */}
      <div className="card-paper border border-primary-100 p-4 mb-4">
        <p className="text-xs font-medium text-text-muted mb-2">关系</p>
        <div className="grid grid-cols-4 gap-2">
          {relationshipOptions.map((r) => (
            <button
              key={r.value}
              onClick={() => setRelationship(r.value)}
              className={`p-2 rounded-xl text-center text-xs transition-all ${ relationship === r.value ? 'bg-primary-100 text-primary-700 border border-primary-200' : 'bg-bg-secondary text-text-secondary border border-transparent hover:border-primary-100' }`}
            >
              <div className="text-lg mb-0.5">{r.emoji}</div>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 亲密度 */}
      <div className="card-paper border border-primary-100 p-4 mb-4">
        <p className="text-xs font-medium text-text-muted mb-2">亲密度</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setIntimacy(level)}
              className={`text-2xl transition-all ${level <= intimacy ? 'scale-110' : 'opacity-30 grayscale'}`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      {/* 标签 */}
      <div className="card-paper border border-primary-100 p-4 mb-4">
        <p className="text-xs font-medium text-text-muted mb-2">标签</p>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full text-xs">
              {tag}
              <button onClick={() => setTags(tags.filter((t) => t !== tag))}>×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="如：小组队友、灵魂好友..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 px-3 py-1.5 bg-bg-secondary rounded-lg text-sm focus:outline-none"
          />
          <button onClick={handleAddTag} className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
            添加
          </button>
        </div>
      </div>

      {/* 初次认识 */}
      <div className="card-paper border border-primary-100 p-4 mb-4">
        <label className="text-xs font-medium text-text-muted mb-2 block">初次认识（可选）</label>
        <input
          type="text"
          placeholder="比如：2023年大一开学"
          value={firstMet}
          onChange={(e) => setFirstMet(e.target.value)}
          className="w-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {/* 备注 */}
      <div className="card-paper border border-primary-100 p-4 mb-6">
        <label className="text-xs font-medium text-text-muted mb-2 block">私人备注（可选）</label>
        <textarea
          placeholder="关于这个人的一些私人观察和备注..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full resize-none text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 disabled:opacity-40 transition-all"
      >
        <Save size={16} />
        保存
      </button>
    </div>
  )
}
