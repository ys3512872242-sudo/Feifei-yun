import { Link } from 'react-router-dom'
import { FileText, Sliders, Download, Trash2, MessageCircle, ArrowRight } from 'lucide-react'

export default function SettingsPage() {
  const handleExport = () => {
    const data: Record<string, any> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!
      if (key.startsWith('feifei-')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key)!)
        } catch {
          data[key] = localStorage.getItem(key)
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feifei-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)!
        if (key.startsWith('feifei-')) {
          localStorage.removeItem(key)
        }
      }
      window.location.reload()
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">设置</h1>
        <p className="text-sm text-text-muted mt-1">管理你的绯绯工作室</p>
      </div>

      <div className="space-y-3">
        {/* 原则宪章 */}
        <Link
          to="/charter"
          className="flex items-center gap-3 p-4 card-paper border border-primary-50 hover:border-primary-300 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <FileText size={20} className="text-primary-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">原则宪章</p>
            <p className="text-xs text-text-muted">绯绯的行为准则和对你的承诺</p>
          </div>
          <ArrowRight size={16} className="text-text-muted" />
        </Link>

        {/* 校准反馈 */}
        <Link
          to="/settings/calibration"
          className="flex items-center gap-3 p-4 card-paper border border-primary-50 hover:border-primary-300 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
            <Sliders size={20} className="text-secondary-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">校准反馈</p>
            <p className="text-xs text-text-muted">调整绯绯的反馈风格和分析偏好</p>
          </div>
          <ArrowRight size={16} className="text-text-muted" />
        </Link>

        {/* 导出数据 */}
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 p-4 card-paper border border-primary-50 hover:border-primary-300 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Download size={20} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">导出数据</p>
            <p className="text-xs text-text-muted">将所有数据导出为 JSON 文件</p>
          </div>
          <ArrowRight size={16} className="text-text-muted" />
        </button>

        {/* 清除数据 */}
        <button
          onClick={handleClear}
          className="w-full flex items-center gap-3 p-4 card-paper border border-red-100 hover:border-primary-300 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-600">清除所有数据</p>
            <p className="text-xs text-text-muted">不可恢复，请先导出备份</p>
          </div>
          <ArrowRight size={16} className="text-text-muted" />
        </button>
      </div>

      {/* 关于 */}
      <div className="mt-8 p-5 card-paper border border-primary-50">
        <h3 className="text-sm font-semibold text-text-primary mb-2">关于绯绯</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          绯绯是你的个人工作室，帮你记录灵感、探索自我、建立真实自信。
          所有数据存储在本地浏览器，不会上传到任何服务器。
        </p>
        <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
          <MessageCircle size={12} />
          <span>诚实不谄媚，透明可追溯</span>
        </div>
      </div>
    </div>
  )
}
