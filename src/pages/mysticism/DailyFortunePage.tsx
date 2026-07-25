import { Link } from 'react-router-dom'
import { Sparkles, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useMysticismStore } from '../../features/mysticism/store'
import { now } from '../../shared/lib'
import type { DailyFortune } from '../../core/types'

const fortuneTemplates = [
  { overall: 5, description: '今天的你充满创造力，灵感如泉涌。适合做需要突破性思维的事，不要给自己设限。', advice: '大胆去尝试那个想了很久的点子吧', luckyColor: '杏粉色', luckyNumber: 7 },
  { overall: 4, description: '能量不错的一天，适合和他人交流碰撞想法。你可能会在对话中获得意想不到的启发。', advice: '主动约个朋友聊聊', luckyColor: '薄荷绿', luckyNumber: 3 },
  { overall: 4, description: '内心平静的一天，适合做一些需要专注和耐心的事情。慢慢来，反而更快。', advice: '安排一段不被打扰的时间', luckyColor: '暖棕色', luckyNumber: 9 },
  { overall: 3, description: '今天可能会有些小波折，但不影响大局。保持平常心，该做的事还是去做。', advice: '把大的任务拆成小步骤', luckyColor: '雾蓝色', luckyNumber: 5 },
  { overall: 3, description: '普通但稳定的一天。适合做一些整理和规划，为接下来的事做好准备。', advice: '花10分钟整理一下工作空间', luckyColor: '奶油白', luckyNumber: 2 },
  { overall: 5, description: '直觉特别敏锐的一天，相信你的第一感觉。适合做决策和判断。', advice: '遇到选择时，相信你的 gut feeling', luckyColor: '深紫色', luckyNumber: 8 },
  { overall: 4, description: '社交能量充沛的一天，适合和人建立联系。你散发的温暖会吸引对的人。', advice: '主动联系一个好久没聊的人', luckyColor: '珊瑚橙', luckyNumber: 4 },
]

export default function DailyFortunePage() {
  const fortunes = useMysticismStore((s) => s.fortunes)
  const addFortune = useMysticismStore((s) => s.addFortune)
  const todayKey = new Date().toISOString().slice(0, 10)
  const todayFortune = fortunes.find((f) => f.date === todayKey)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateFortune = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const template = fortuneTemplates[Math.floor(Math.random() * fortuneTemplates.length)]
      const fortune: DailyFortune = {
        date: todayKey,
        overall: template.overall,
        categories: {
          study: Math.max(1, Math.min(5, template.overall + Math.floor(Math.random() * 3) - 1)),
          love: Math.max(1, Math.min(5, template.overall + Math.floor(Math.random() * 3) - 1)),
          creativity: Math.max(1, Math.min(5, template.overall + Math.floor(Math.random() * 3) - 1)),
          social: Math.max(1, Math.min(5, template.overall + Math.floor(Math.random() * 3) - 1)),
        },
        description: template.description,
        luckyColor: template.luckyColor,
        luckyNumber: template.luckyNumber,
        advice: template.advice,
        disclaimer: '运势仅供娱乐和反思，你才是自己命运的主人。绯绯提醒：理性看待，快乐生活。',
        generatedAt: now(),
      }
      addFortune(fortune)
      setIsGenerating(false)
    }, 800)
  }

  const starBar = (level: number) => '⭐'.repeat(level) + '·'.repeat(5 - level)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">每日运势</h1>
          <p className="text-sm text-text-muted">{todayKey}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/mysticism/tarot" className="text-xs px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors">
            🃏 塔罗
          </Link>
          <Link to="/mysticism/bazi" className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors">
            🎋 八字
          </Link>
        </div>
      </div>

      {!todayFortune ? (
        <div className="text-center py-12 card-paper border border-dashed border-primary-200 mb-6">
          <div className="text-5xl mb-4">🔮</div>
          <p className="text-text-secondary mb-4">今日运势尚未生成</p>
          <button
            onClick={generateFortune}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-all"
          >
            {isGenerating ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {isGenerating ? '正在感应...' : '生成今日运势'}
          </button>
        </div>
      ) : (
        <>
          {/* 运势卡 */}
          <div className="card-paper border border-primary-100 p-6 mb-6 text-center">
            <div className="text-4xl mb-2">
              {todayFortune.overall >= 5 ? '🌟' : todayFortune.overall >= 4 ? '☀️' : todayFortune.overall >= 3 ? '🌤️' : '🌥️'}
            </div>
            <div className="text-lg mb-1">{starBar(todayFortune.overall)}</div>
            <p className="text-sm text-text-secondary leading-relaxed mt-3">
              {todayFortune.description}
            </p>
            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-primary-50">
              <div className="text-center">
                <p className="text-xs text-text-muted">幸运色</p>
                <p className="text-sm font-medium text-text-primary">{todayFortune.luckyColor}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-muted">幸运数字</p>
                <p className="text-sm font-medium text-text-primary">{todayFortune.luckyNumber}</p>
              </div>
            </div>
          </div>

          {/* 分类运势 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(todayFortune.categories).map(([key, val]) => (
              <div key={key} className="card-paper border border-primary-50 p-4 text-center">
                <p className="text-xs text-text-muted mb-1">
                  {key === 'study' ? '📖 学业' : key === 'love' ? '💕 感情' : key === 'creativity' ? '🎨 创意' : '🤝 社交'}
                </p>
                <p className="text-sm">{starBar(val)}</p>
              </div>
            ))}
          </div>

          {/* 建议 */}
          <div className="bg-secondary-50/50 rounded-2xl border border-secondary-100 p-4 mb-6">
            <p className="text-sm text-secondary-700">
              💡 {todayFortune.advice}
            </p>
          </div>

          <button
            onClick={generateFortune}
            className="w-full py-2.5 text-text-muted text-sm hover:text-text-secondary transition-colors"
          >
            重新生成
          </button>
        </>
      )}

      {/* 免责声明 */}
      <div className="mt-4">
        <p className="text-xs text-text-muted text-center leading-relaxed">
          ⚠️ 运势仅供娱乐和反思，你才是自己命运的主人。<br />
          绯绯提醒：理性看待，快乐生活。
        </p>
      </div>
    </div>
  )
}
