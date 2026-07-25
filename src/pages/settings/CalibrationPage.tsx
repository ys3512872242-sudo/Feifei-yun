import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useDiscoveryStore } from '../../features/discovery/store'

export default function CalibrationPage() {
  const preferences = useDiscoveryStore((s) => s.profile.preferences)
  const updatePreferences = useDiscoveryStore((s) => s.updatePreferences)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/settings" className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-semibold text-text-primary">校准反馈</h1>
      </div>

      <p className="text-sm text-text-secondary mb-6">
        告诉绯绯你喜欢的反馈风格，让绯绯更懂你。
      </p>

      {/* 反馈风格 */}
      <div className="card-paper border border-primary-100 p-4 mb-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">反馈风格</h3>
        <div className="space-y-2">
          {([
            { value: 'gentle' as const, label: '温和型', desc: '温柔但有原则，肯定中带建设性意见' },
            { value: 'direct' as const, label: '直接型', desc: '直截了当，不绕弯子，高效沟通' },
            { value: 'analytical' as const, label: '分析型', desc: '数据驱动，逻辑清晰，注重推理过程' },
          ]).map((style) => (
            <button
              key={style.value}
              onClick={() => updatePreferences({ feedbackStyle: style.value })}
              className={`w-full p-3 rounded-xl text-left transition-all ${ preferences.feedbackStyle === style.value ? 'bg-primary-50 border border-primary-200' : 'bg-bg-secondary border border-transparent hover:border-primary-100' }`}
            >
              <p className="text-sm font-medium text-text-primary">{style.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 兴趣领域 */}
      <div className="card-paper border border-primary-100 p-4 mb-6">
        <h3 className="text-sm font-semibold text-text-primary mb-3">兴趣领域</h3>
        <p className="text-xs text-text-muted mb-3">
          告诉绯绯你关注的方向，灵感深化时会更有针对性
        </p>
        <div className="flex flex-wrap gap-2">
          {['内容创作', '新媒体', '视频制作', '写作', '设计', '心理学', '哲学', '社会学', '科技', '创业', '个人成长', '玄学'].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                const current = preferences.interestTopics
                const updated = current.includes(topic)
                  ? current.filter((t) => t !== topic)
                  : [...current, topic]
                updatePreferences({ interestTopics: updated })
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${ preferences.interestTopics.includes(topic) ? 'bg-primary-100 text-primary-700 border border-primary-200' : 'bg-bg-secondary text-text-secondary border border-transparent hover:border-primary-100' }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-text-muted text-center">
        绯绯会根据你的反馈不断调整，越来越懂你
      </p>
    </div>
  )
}
