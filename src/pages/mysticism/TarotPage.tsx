import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { useMysticismStore } from '../../features/mysticism/store'
import { generateId, now } from '../../shared/lib'
import type { TarotReading, TarotCardResult } from '../../core/types'

// 22张大阿卡纳简化数据
const majorArcana: { id: number; name: string; nameZh: string; upright: string; reversed: string }[] = [
  { id: 0, name: 'The Fool', nameZh: '愚者', upright: '新的开始，冒险精神，天真无畏', reversed: '鲁莽，缺乏计划，犹豫不决' },
  { id: 1, name: 'The Magician', nameZh: '魔术师', upright: '创造力，技能，意志力，自信', reversed: '滥用技能，缺乏方向，欺骗' },
  { id: 2, name: 'The High Priestess', nameZh: '女祭司', upright: '直觉，潜意识，内在智慧', reversed: '忽视直觉，表面化，隐藏的秘密' },
  { id: 3, name: 'The Empress', nameZh: '女皇', upright: '丰盛，滋养，创造力，自然', reversed: '依赖，匮乏，创造力阻塞' },
  { id: 4, name: 'The Emperor', nameZh: '皇帝', upright: '权威，结构，稳定，领导力', reversed: '专制，僵化，缺乏纪律' },
  { id: 5, name: 'The Hierophant', nameZh: '教皇', upright: '传统，智慧，精神指引', reversed: '反叛，非传统，教条主义' },
  { id: 6, name: 'The Lovers', nameZh: '恋人', upright: '爱，和谐，选择，关系', reversed: '不和谐，分离，错误选择' },
  { id: 7, name: 'The Chariot', nameZh: '战车', upright: '胜利，决心，掌控，前进', reversed: '失控，失败，方向错误' },
  { id: 8, name: 'Strength', nameZh: '力量', upright: '勇气，内在力量，耐心', reversed: '软弱，自我怀疑，失控' },
  { id: 9, name: 'The Hermit', nameZh: '隐者', upright: '内省，孤独，寻求真理', reversed: '孤立，逃避，过度内省' },
  { id: 10, name: 'Wheel of Fortune', nameZh: '命运之轮', upright: '命运转折，机遇，循环', reversed: '厄运，抵抗变化，轮回' },
  { id: 11, name: 'Justice', nameZh: '正义', upright: '公正，真相，因果，平衡', reversed: '不公，逃避责任，偏见' },
  { id: 12, name: 'The Hanged Man', nameZh: '倒吊人', upright: '牺牲，换个角度，等待', reversed: '停滞，不愿牺牲，固执' },
  { id: 13, name: 'Death', nameZh: '死神', upright: '结束，转变，新生，放下', reversed: '抗拒改变，停滞，恐惧' },
  { id: 14, name: 'Temperance', nameZh: '节制', upright: '平衡，适度，耐心，调和', reversed: '极端，失衡，过度' },
  { id: 15, name: 'The Devil', nameZh: '恶魔', upright: '束缚，物质主义，欲望', reversed: '挣脱，觉醒，重获自由' },
  { id: 16, name: 'The Tower', nameZh: '塔', upright: '突变，崩塌，启示，觉醒', reversed: '逃避改变，恐惧，勉强维持' },
  { id: 17, name: 'The Star', nameZh: '星星', upright: '希望，灵感，疗愈，宁静', reversed: '绝望，失去信心，迷失' },
  { id: 18, name: 'The Moon', nameZh: '月亮', upright: '幻觉，恐惧，潜意识，直觉', reversed: '恐惧消散，真相浮现，混乱' },
  { id: 19, name: 'The Sun', nameZh: '太阳', upright: '快乐，成功，活力，清晰', reversed: '暂时的阴霾，过度乐观，延迟' },
  { id: 20, name: 'Judgement', nameZh: '审判', upright: '重生，召唤，觉醒，宽恕', reversed: '逃避召唤，自我评判，遗憾' },
  { id: 21, name: 'The World', nameZh: '世界', upright: '完成，圆满，成就，旅程', reversed: '未完成��拖延，不完整' },
]

export default function TarotPage() {
  const addTarotReading = useMysticismStore((s) => s.addTarotReading)
  const tarotReadings = useMysticismStore((s) => s.tarotReadings)
  const [spreadType, setSpreadType] = useState<'single' | 'three-card'>('single')
  const [question, setQuestion] = useState('')
  const [drawnCards, setDrawnCards] = useState<TarotCardResult[] | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const drawCards = () => {
    setIsDrawing(true)
    const count = spreadType === 'single' ? 1 : 3
    const positions = spreadType === 'single' ? ['指引'] : ['过去', '现在', '未来']

    setTimeout(() => {
      const shuffled = [...majorArcana].sort(() => Math.random() - 0.5)
      const cards: TarotCardResult[] = shuffled.slice(0, count).map((card, i) => ({
        cardId: card.id,
        name: card.name,
        nameZh: card.nameZh,
        position: Math.random() > 0.5 ? 'upright' : 'reversed' as const,
        positionName: positions[i],
      }))

      setDrawnCards(cards)

      // 生成解读
      const interpretation = cards.map((c) => {
        const cardData = majorArcana.find((m) => m.id === c.cardId)!
        const meaning = c.position === 'upright' ? cardData.upright : cardData.reversed
        return `${c.positionName} · ${c.nameZh}${c.position === 'reversed' ? '（逆位）' : ''}：${meaning}`
      }).join('\n\n')

      const reading: TarotReading = {
        id: generateId(),
        date: new Date().toISOString().slice(0, 10),
        spreadType,
        question: question.trim() || undefined,
        cards,
        interpretation,
        createdAt: now(),
      }
      addTarotReading(reading)
      setIsDrawing(false)
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/mysticism" className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-semibold text-text-primary">塔罗</h1>
      </div>

      {/* 抽牌区 */}
      {!drawnCards ? (
        <>
          {/* 牌阵选择 */}
          <div className="card-paper border border-primary-100 p-4 mb-4">
            <p className="text-xs font-medium text-text-muted mb-3">选择牌阵</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSpreadType('single')}
                className={`flex-1 p-3 rounded-xl text-center transition-all ${ spreadType === 'single' ? 'bg-purple-50 border border-purple-200 text-purple-700' : 'bg-bg-secondary border border-transparent text-text-secondary' }`}
              >
                <div className="text-2xl mb-1">🃏</div>
                <p className="text-sm font-medium">单张</p>
                <p className="text-xs text-text-muted">每日指引</p>
              </button>
              <button
                onClick={() => setSpreadType('three-card')}
                className={`flex-1 p-3 rounded-xl text-center transition-all ${ spreadType === 'three-card' ? 'bg-purple-50 border border-purple-200 text-purple-700' : 'bg-bg-secondary border border-transparent text-text-secondary' }`}
              >
                <div className="text-2xl mb-1">🃏🃏🃏</div>
                <p className="text-sm font-medium">三张</p>
                <p className="text-xs text-text-muted">过去·现在·未来</p>
              </button>
            </div>
          </div>

          {/* 问题 */}
          <div className="card-paper border border-primary-100 p-4 mb-6">
            <p className="text-xs font-medium text-text-muted mb-2">想问什么？（可选）</p>
            <textarea
              placeholder="在心里默念你的问题..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              className="w-full resize-none text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>

          <button
            onClick={drawCards}
            disabled={isDrawing}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-500 text-white rounded-xl font-medium text-sm hover:bg-purple-600 disabled:opacity-50 transition-all"
          >
            {isDrawing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                洗牌中...
              </>
            ) : (
              '🃏 开始抽牌'
            )}
          </button>
        </>
      ) : (
        <>
          {/* ���牌结果 */}
          <div className={`grid ${spreadType === 'single' ? 'grid-cols-1 max-w-[180px]' : 'grid-cols-3'} gap-4 mx-auto mb-6`}>
          {drawnCards.map((card, i) => (
                <div
                  key={i}
                  className={`card-paper border p-4 text-center ${ card.position === 'reversed' ? 'border-orange-200 rotate-180' : 'border-purple-200' }`}
                >
                  <div className={card.position === 'reversed' ? 'rotate-180' : ''}>
                    <div className="text-3xl mb-2">
                      {card.position === 'reversed' ? '🙃' : '🃏'}
                    </div>
                    <p className="text-sm font-semibold text-text-primary">{card.nameZh}</p>
                    {card.position === 'reversed' && (
                      <p className="text-xs text-orange-500 mt-0.5">逆位</p>
                    )}
                    <p className="text-xs text-text-muted mt-1">{card.positionName}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* 解读 */}
          <div className="card-paper border border-primary-100 p-5 mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3">🔮 解读</h3>
            <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {drawnCards.map((c) => {
                const cardData = majorArcana.find((m) => m.id === c.cardId)!
                const meaning = c.position === 'upright' ? cardData.upright : cardData.reversed
                return (
                  <div key={c.cardId} className="mb-3 pb-3 border-b border-primary-50 last:border-0 last:mb-0 last:pb-0">
                    <p className="font-medium text-text-primary mb-1">
                      {c.positionName} · {c.nameZh}{c.position === 'reversed' ? '（逆位）' : ''}
                    </p>
                    <p>{meaning}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => { setDrawnCards(null); setQuestion('') }}
            className="w-full py-2.5 text-text-muted text-sm hover:text-text-secondary transition-colors"
          >
            重新抽牌
          </button>
        </>
      )}

      {/* 历史记录 */}
      {tarotReadings.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-text-primary mb-3">📜 抽牌记录</h3>
          <div className="space-y-2">
            {tarotReadings.slice(0, 5).map((reading) => (
              <div key={reading.id} className="card-paper border border-primary-50 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{reading.date}</span>
                  <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">
                    {reading.spreadType === 'single' ? '单张' : '三张'}
                  </span>
                  {reading.question && (
                    <span className="text-xs text-text-secondary truncate">"{reading.question}"</span>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">{reading.interpretation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 免责声明 */}
      <p className="text-xs text-text-muted text-center mt-6">
        ⚠️ 塔罗是自我探索的工具，并非预测未来的手段。解读仅供参考。
      </p>
    </div>
  )
}
