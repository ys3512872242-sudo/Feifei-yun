import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useMysticismStore } from '../../features/mysticism/store'

export default function BaziPage() {
  const mysticProfile = useMysticismStore((s) => s.mysticProfile)
  const updateMysticProfile = useMysticismStore((s) => s.updateMysticProfile)
  const [birthDate, setBirthDate] = useState(mysticProfile.baziProfile?.birthDate || '')
  const [birthTime, setBirthTime] = useState(mysticProfile.baziProfile?.birthTime || '')
  const [gender, setGender] = useState<'male' | 'female'>(mysticProfile.baziProfile?.gender || 'female')
  const [zodiacSign, setZodiacSign] = useState(mysticProfile.zodiacSign || '')
  const [saved, setSaved] = useState(false)

  const zodiacSigns = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']

  const handleSave = () => {
    updateMysticProfile({
      baziProfile: {
        birthDate: birthDate || undefined,
        birthTime: birthTime || undefined,
        gender,
      } as any,
      zodiacSign: zodiacSign || undefined,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/mysticism" className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-semibold text-text-primary">八字档案</h1>
      </div>

      {/* 占星 */}
      <div className="card-paper border border-primary-100 p-4 mb-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">⭐ 星座</h3>
        <div className="grid grid-cols-4 gap-2">
          {zodiacSigns.map((z) => (
            <button
              key={z}
              onClick={() => setZodiacSign(z)}
              className={`p-2 rounded-xl text-xs transition-all ${ zodiacSign === z ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-bg-secondary text-text-secondary border border-transparent hover:border-primary-100' }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* 八字基础 */}
      <div className="card-paper border border-primary-100 p-4 mb-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">🎋 生辰信息</h3>
        <p className="text-xs text-text-muted mb-3">
          八字排盘需要准确的出生日期和时间。当前版本仅支持信息录入，完整排盘功能即将推出。
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">出生日期</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 bg-bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">出生时间</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-3 py-2 bg-bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">性别</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-2 rounded-xl text-sm transition-all ${ gender === 'male' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-bg-secondary text-text-secondary' }`}
              >
                男
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-2 rounded-xl text-sm transition-all ${ gender === 'female' ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-bg-secondary text-text-secondary' }`}
              >
                女
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 transition-all"
      >
        <Save size={16} />
        {saved ? '已保存 ✓' : '保存档案'}
      </button>

      <p className="text-xs text-text-muted text-center mt-6">
        ⚠️ 八字命理是传统文化的一部分，请理性看待。
      </p>
    </div>
  )
}
