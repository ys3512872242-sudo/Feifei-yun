import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { usePeopleStore } from '../../features/people/store'
import type { EmotionType } from '../../core/types'

const emotions: { value: EmotionType; label: string; emoji: string }[] = [
  { value: 'anxious', label: '焦虑', emoji: '😰' },
  { value: 'excited', label: '兴奋', emoji: '🤩' },
  { value: 'calm', label: '平静', emoji: '😌' },
  { value: 'curious', label: '好奇', emoji: '🤔' },
  { value: 'tired', label: '疲惫', emoji: '😴' },
  { value: 'inspired', label: '灵感', emoji: '✨' },
  { value: 'neutral', label: '中性', emoji: '💬' },
]

export default function VentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const person = usePeopleStore((s) => s.getPerson(id!))
  const addInteraction = usePeopleStore((s) => s.addInteraction)

  const [content, setContent] = useState('')
  const [trigger, setTrigger] = useState('')
  const [feeling, setFeeling] = useState('')
  const [emotion, setEmotion] = useState<EmotionType>('anxious')

  if (!person) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted">联系人不存在</p>
        <Link to="/people" className="text-primary-600 text-sm mt-2 inline-block">返回</Link>
      </div>
    )
  }

  const handleSubmit = () => {
    if (!content.trim()) return
    addInteraction({
      personId: person.id,
      date: new Date().toISOString().slice(0, 10),
      type: 'chat',
      content: content.trim(),
      emotion,
      isVent: true,
      ventDetail: {
        trigger: trigger.trim() || '未指定',
        feeling: feeling.trim() || '未指定',
        resolved: false,
      },
    })
    navigate(`/people/${person.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">吐槽 · {person.name}</h1>
        <div className="w-8" />
      </div>

      <div className="bg-orange-50/50 rounded-2xl border border-orange-100 p-4 mb-6">
        <p className="text-xs text-orange-600">
          这里很安全。绯绯不会评判你，也不会把你的吐槽告诉任何人。所有内容都保存在本地。
        </p>
      </div>

      <div className="card-paper border border-primary-100 p-4 mb-4">
        <label className="text-xs font-medium text-text-muted mb-2 block">发生了什么？</label>
        <textarea
          placeholder="写下你想吐槽的事..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full resize-none text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          autoFocus
        />
      </div>

      <div className="card-paper border border-primary-100 p-4 mb-4">
        <label className="text-xs font-medium text-text-muted mb-2 block">触发事件（简短描述）</label>
        <input
          type="text"
          placeholder="比如：他又放我鸽子了"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          className="w-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      <div className="card-paper border border-primary-100 p-4 mb-4">
        <label className="text-xs font-medium text-text-muted mb-2 block">你的感受</label>
        <input
          type="text"
          placeholder="比如：很生气，也很失望"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          className="w-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <p className="text-xs font-medium text-text-muted mb-2">当前情绪</p>
        <div className="flex gap-2 flex-wrap">
          {emotions.map((e) => (
            <button
              key={e.value}
              onClick={() => setEmotion(e.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${ emotion === e.value ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-bg-card text-text-secondary border border-primary-100' }`}
            >
              {e.emoji} {e.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!content.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-xl font-medium text-sm hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <Send size={16} />
        记录吐槽
      </button>
    </div>
  )
}
