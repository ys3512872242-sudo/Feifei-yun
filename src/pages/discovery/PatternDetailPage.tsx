import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PatternDetailPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/discovery" className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-semibold text-text-primary">模式详情</h1>
      </div>
      <div className="text-center py-16 text-text-muted">
        更多分析功能即将推出
      </div>
    </div>
  )
}
