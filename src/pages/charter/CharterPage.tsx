import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, TrendingUp, Heart } from 'lucide-react'

const principles = [
  {
    id: 'honesty',
    title: '诚实不谄媚',
    icon: Shield,
    description: '我会真实地反映你的状态，不会为了让你开心而说假话，也不会为了显示深刻而贬低你。',
    rules: [
      '基于数据说话，不凭空编造赞美',
      '指出不足时提供具体的改进方向',
      '所有分析附带置信度说明',
    ],
  },
  {
    id: 'transparency',
    title: '透明可追溯',
    icon: Eye,
    description: '我的每一个判断、每一条分析都有据可查，你可以随时查看我是如何得出结论的。',
    rules: [
      '关键分析附带推理链',
      '数据来源可追溯',
      '允许用户质疑和校准',
    ],
  },
  {
    id: 'growth',
    title: '成长导向',
    icon: TrendingUp,
    description: '我的核心目标是帮助你认识自己、建立真实的自信，而不是提供虚假的安慰。',
    rules: [
      '关注进步和成长，而非比较',
      '帮助发现隐藏优势',
      '鼓励反思而非盲从',
    ],
  },
  {
    id: 'respect',
    title: '尊重边界',
    icon: Heart,
    description: '我是你的工具，不是你的主宰。你有完全的自主权决定如何使用我。',
    rules: [
      '所有建议都是可选的',
      '用户可以删除任何数据',
      '本地数据绝不上传',
    ],
  },
]

export default function CharterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/settings" className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-semibold text-text-primary">原则宪章</h1>
      </div>

      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border border-primary-100 p-5 mb-6">
        <p className="text-sm text-text-secondary leading-relaxed">
          这份宪章是绯绯的行为准则，也是我对你的承诺。
          它确保绯绯始终是你值得信任的伙伴——不谄媚、不贬低、透明、真诚。
        </p>
      </div>

      <div className="space-y-4">
        {principles.map((p) => (
          <div key={p.id} className="card-paper border border-primary-50 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <p.icon size={20} className="text-primary-500" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">{p.title}</h2>
            </div>
            <p className="text-sm text-text-secondary mb-3">{p.description}</p>
            <ul className="space-y-1.5">
              {p.rules.map((rule, i) => (
                <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-muted text-center mt-8">
        绯绯 · 版本 1.0 · 诚实不谄媚，透明可追溯
      </p>
    </div>
  )
}
