import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useInspirationStore } from '../../features/inspiration/store'
import type { EmotionType, InspirationType } from '../../core/types'

const inspirationTypes: { value: InspirationType; label: string; emoji: string }[] = [
  { value: 'creative', label: '创意点子', emoji: '💡' },
  { value: 'observation', label: '碎片观察', emoji: '👀' },
  { value: 'emotion', label: '情绪感受', emoji: '💭' },
  { value: 'knowledge', label: '知识碎片', emoji: '📚' },
  { value: 'intuition', label: '模糊直觉', emoji: '🔮' },
]

const emotions: { value: EmotionType; label: string; emoji: string }[] = [
  { value: 'excited', label: '兴奋', emoji: '🤩' },
  { value: 'calm', label: '平静', emoji: '😌' },
  { value: 'curious', label: '好奇', emoji: '🤔' },
  { value: 'inspired', label: '灵感', emoji: '✨' },
  { value: 'anxious', label: '焦虑', emoji: '😰' },
  { value: 'tired', label: '疲惫', emoji: '😴' },
  { value: 'neutral', label: '中性', emoji: '💬' },
]

export default function InspirationCreatePage() {
  const navigate = useNavigate()
  const add = useInspirationStore((s) => s.add)
  const [content, setContent] = useState('')
  const [type, setType] = useState<InspirationType>('observation')
  const [emotion, setEmotion] = useState<EmotionType>('neutral')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [source, setSource] = useState('')

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleSubmit = () => {
    if (!content.trim()) return
    const item = add({
      content: content.trim(),
      inspirationType: type,
      tags,
      emotion,
      source: source.trim() || undefined,
    })
    navigate(`/inspiration/${item.id}/deepen`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* 顶部 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">记录灵感</h1>
        <div className="w-8" />
      </div>

      {/* 内容输入 */}
      <div className="card-paper border border-primary-100 p-4 mb-4">
        <textarea
          placeholder="写下你的想法... 可以是任何碎片化的东西"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full resize-none text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          autoFocus
        />
        <div className="text-right text-xs text-text-muted">
          {content.length} 字
        </div>
      </div>

      {/* 灵感类型 */}
      <div className="mb-4">
        <p className="text-xs font-medium text-text-muted mb-2">灵感类型</p>
        <div className="flex gap-2 flex-wrap">
          {inspirationTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${ type === t.value ? 'bg-primary-100 text-primary-700 border border-primary-200' : 'bg-bg-card text-text-secondary border border-primary-100' }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 情绪 */}
      <div className="mb-4">
        <p className="text-xs font-medium text-text-muted mb-2">当前情绪</p>
        <div className="flex gap-2 flex-wrap">
          {emotions.map((e) => (
            <button
              key={e.value}
              onClick={() => setEmotion(e.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${ emotion === e.value ? 'bg-primary-100 text-primary-700 border border-primary-200' : 'bg-bg-card text-text-secondary border border-primary-100' }`}
            >
              {e.emoji} {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* 标签 */}
      <div className="mb-4">
        <p className="text-xs font-medium text-text-muted mb-2">标签</p>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full text-xs"
            >
              {tag}
              <button
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className="hover:text-primary-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="添加标签..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 px-3 py-2 bg-bg-card border border-primary-100 rounded-xl text-sm focus:outline-none focus:border-primary-300"
          />
          <button
            onClick={handleAddTag}
            className="px-3 py-2 bg-bg-secondary text-text-secondary rounded-xl text-sm hover:bg-primary-50 transition-colors"
          >
            添加
          </button>
        </div>
      </div>

      {/* 来源 */}
      <div className="mb-6">
        <p className="text-xs font-medium text-text-muted mb-2">来源（可选）</p>
        <input
          type="text"
          placeholder="比如：刷小红书看到的、上课想到的..."
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full px-3 py-2 bg-bg-card border border-primary-100 rounded-xl text-sm focus:outline-none focus:border-primary-300"
        />
      </div>

      {/* 提交 */}
      <button
        onClick={handleSubmit}
        disabled={!content.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <Save size={16} />
        保存并开始深化
      </button>

      <p className="text-xs text-text-muted text-center mt-3">
        保存后，绯绯会帮你判断这个想法是否值得深挖
      </p>
    </div>
  )
}
