import { TrendingUp, Target, Lightbulb } from 'lucide-react'
import { useDiscoveryStore } from '../../features/discovery/store'
import { useInspirationStore } from '../../features/inspiration/store'
import { usePeopleStore } from '../../features/people/store'
import { useState, useEffect } from 'react'
import type { Strength, BehaviorPattern } from '../../core/types'

// 简单的本地模式分析引擎
function analyzePatterns(inspirationCount: number, cultivatingCount: number, peopleCount: number, ventCount: number): {
  strengths: Omit<Strength, 'id' | 'discoveredAt' | 'confirmedByUser'>[]
  patterns: Omit<BehaviorPattern, 'id' | 'discoveredAt'>[]
} {
  const strengths: Omit<Strength, 'id' | 'discoveredAt' | 'confirmedByUser'>[] = []
  const patterns: Omit<BehaviorPattern, 'id' | 'discoveredAt'>[] = []

  if (inspirationCount >= 3) {
    strengths.push({
      name: '灵感捕捉者',
      description: '你有敏锐的观察力和记录习惯，善于捕捉生活中的碎片想法',
      evidence: [{ id: '1', sourceType: 'inspiration', sourceId: '', description: `已记录 ${inspirationCount} 条灵感`, createdAt: Date.now() }],
      confidence: Math.min(inspirationCount / 10, 1),
    })
    patterns.push({
      name: '持续输出型',
      description: '你保持着持续的思考和记录习惯，这种积累会带来复利效应',
      type: 'creative',
      observations: [{ date: new Date().toISOString().slice(0, 10), event: `累计 ${inspirationCount} 条灵感`, context: '灵感速记' }],
      confidence: 0.7,
    })
  }

  if (cultivatingCount > 0) {
    strengths.push({
      name: '想法筛选力',
      description: '你不是什么都做，而是有意识地筛选值得深挖的想法',
      evidence: [{ id: '2', sourceType: 'inspiration', sourceId: '', description: `有 ${cultivatingCount} 个灵感正在培育`, createdAt: Date.now() }],
      confidence: 0.6,
    })
  }

  if (peopleCount >= 2) {
    strengths.push({
      name: '关系觉察力',
      description: '你有意识地维护和观察自己的人际关系网络',
      evidence: [{ id: '3', sourceType: 'pattern', sourceId: '', description: `记录了 ${peopleCount} 位联系人`, createdAt: Date.now() }],
      confidence: 0.5,
    })
    patterns.push({
      name: '社交记录型',
      description: '你倾向于记录和分析人际关系，这说明你在意人与人之间的连接质量',
      type: 'social',
      observations: [{ date: new Date().toISOString().slice(0, 10), event: `管理 ${peopleCount} 位联系人`, context: '人际关系' }],
      confidence: 0.5,
    })
  }

  if (ventCount > 0) {
    patterns.push({
      name: '情绪外化型',
      description: '你会通过吐槽来释放情绪，这是一种健康的情绪处理方式',
      type: 'emotion',
      observations: [{ date: new Date().toISOString().slice(0, 10), event: `${ventCount} 次吐槽记录`, context: '人际关系-吐槽' }],
      confidence: 0.6,
    })
  }

  return { strengths, patterns }
}

export default function DiscoveryPage() {
  const profile = useDiscoveryStore((s) => s.profile)
  const updateProfile = useDiscoveryStore((s) => s.updateProfile)
  const inspirations = useInspirationStore((s) => s.inspirations)
  const people = usePeopleStore((s) => s.people)
  const interactions = usePeopleStore((s) => s.interactions)

  const cultivatingCount = inspirations.filter((i) => i.status === 'cultivating').length
  const ventCount = interactions.filter((i) => i.isVent).length

  const [analyzed, setAnalyzed] = useState(false)

  useEffect(() => {
    if (!analyzed && inspirations.length > 0) {
      const { strengths, patterns } = analyzePatterns(
        inspirations.length,
        cultivatingCount,
        people.length,
        ventCount
      )

      if (strengths.length > 0 || patterns.length > 0) {
        const existingNames = new Set(profile.strengths.map((s) => s.name))
        const newStrengths = strengths.filter((s) => !existingNames.has(s.name))
        const newPatterns = patterns.filter((p) => !profile.patterns.some((ep) => ep.name === p.name))

        if (newStrengths.length > 0 || newPatterns.length > 0) {
          updateProfile({
            strengths: [
              ...profile.strengths,
              ...newStrengths.map((s) => ({
                ...s,
                id: crypto.randomUUID(),
                discoveredAt: Date.now(),
                confirmedByUser: false,
              })),
            ],
            patterns: [
              ...profile.patterns,
              ...newPatterns.map((p) => ({
                ...p,
                id: crypto.randomUUID(),
                discoveredAt: Date.now(),
              })),
            ],
          })
        }
      }
      setAnalyzed(true)
    }
  }, [inspirations.length])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">自我发现</h1>
        <p className="text-sm text-text-muted mt-1">
          绯绯帮你看见真实的自己
        </p>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card-paper border border-primary-50 p-4 text-center">
          <p className="text-2xl font-bold text-primary-500">{inspirations.length}</p>
          <p className="text-xs text-text-muted mt-1">灵感记录</p>
        </div>
        <div className="card-paper border border-primary-50 p-4 text-center">
          <p className="text-2xl font-bold text-secondary-500">{cultivatingCount}</p>
          <p className="text-xs text-text-muted mt-1">培育中</p>
        </div>
        <div className="card-paper border border-primary-50 p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{people.length}</p>
          <p className="text-xs text-text-muted mt-1">联系人</p>
        </div>
      </div>

      {/* 优势 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-primary-500" />
          <h2 className="text-sm font-semibold text-text-primary">发现优势</h2>
        </div>
        {profile.strengths.length === 0 ? (
          <div className="card-paper border border-dashed border-primary-200 p-6 text-center">
            <p className="text-text-muted text-sm">
              开始记录灵感和互动后，绯绯会自动帮你发现优势
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.strengths.map((strength) => (
              <div key={strength.id} className="card-paper border border-primary-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-text-primary">{strength.name}</h3>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i <= Math.round(strength.confidence * 5) ? 'bg-primary-400' : 'bg-primary-100'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-text-secondary mb-2">{strength.description}</p>
                {!strength.confirmedByUser ? (
                  <button
                    onClick={() => useDiscoveryStore.getState().confirmStrength(strength.id)}
                    className="text-xs text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    确认这个优势
                  </button>
                ) : (
                  <span className="text-xs text-green-500">✓ 已确认</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 行为模式 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-secondary-500" />
          <h2 className="text-sm font-semibold text-text-primary">行为模式</h2>
        </div>
        {profile.patterns.length === 0 ? (
          <div className="card-paper border border-dashed border-primary-200 p-6 text-center">
            <p className="text-text-muted text-sm">
              积累更多数据后，绯绯会帮你识别行为模式
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.patterns.map((pattern) => (
              <div key={pattern.id} className="card-paper border border-secondary-50 p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-1">{pattern.name}</h3>
                <p className="text-xs text-text-secondary">{pattern.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ pattern.type === 'creative' ? 'bg-purple-50 text-purple-600' : pattern.type === 'emotion' ? 'bg-orange-50 text-orange-600' : pattern.type === 'social' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600' }`}>
                    {pattern.type === 'creative' ? '创作' :
                     pattern.type === 'emotion' ? '情绪' :
                     pattern.type === 'social' ? '社交' : '工作'}
                  </span>
                  <span className="text-xs text-text-muted">
                    置信度 {Math.round(pattern.confidence * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 成长提示 */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border border-primary-100 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={16} className="text-primary-500" />
          <h2 className="text-sm font-semibold text-text-primary">绯绯的观察</h2>
        </div>
        {inspirations.length === 0 ? (
          <p className="text-sm text-text-secondary leading-relaxed">
            我还在等待你的第一条记录。当你开始使用绯绯，我会认真观察你的模式，
            然后告诉你我看到了什么——诚实的、有理有据的。
          </p>
        ) : (
          <p className="text-sm text-text-secondary leading-relaxed">
            你已经记录了 {inspirations.length} 条灵感
            {cultivatingCount > 0 && `，其中 ${cultivatingCount} 条正在培育`}。
            {people.length > 0 && ` 你还关注着 ${people.length} 段人际关系`}。
            继续保持，我会在你积累足够数据后，给你更深入的分析。
          </p>
        )}
      </div>
    </div>
  )
}
