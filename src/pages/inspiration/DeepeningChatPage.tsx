import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Send, Sprout, Archive, Loader2 } from 'lucide-react'
import { useInspirationStore } from '../../features/inspiration/store'
import { generateId, now } from '../../shared/lib'
import type { DeepeningQuestion, QuestionType, JudgmentLevel, InspirationType } from '../../core/types'

function generateQuestions(type: InspirationType, _content: string): DeepeningQuestion[] {
  const strategies: Record<InspirationType, { questions: string[]; types: QuestionType[] }> = {
    creative: {
      questions: [
        '这个创意的目标受众是谁？你想触达什么样的人？',
        '你觉得你来做这件事，和别人做最大的不同会是什么？',
        '如果把这个想法缩小到最小可行版本，它是什么样子？',
        '你目前已经具备哪些做这件事的条件或技能？',
      ],
      types: ['what_if', 'expand', 'how', 'connect'],
    },
    observation: {
      questions: [
        '是什么让你觉得这个现象值得记下来？',
        '这个现象和你最近关注的其他事情有什么关联吗？',
        '如果这个现象继续发展下去，你觉得会发生什么？',
        '你观察到的这个现象，有没有一个反例？',
      ],
      types: ['why', 'connect', 'what_if', 'expand'],
    },
    emotion: {
      questions: [
        '这种感觉最强烈的时候，是什么场景？',
        '你觉得是什么触发了这种感觉？',
        '这种感觉让你想做什么？或者不想做什么？',
        '如果用一个画面来描述这种情绪，会是什么样的？',
      ],
      types: ['why', 'how', 'what_if', 'expand'],
    },
    knowledge: {
      questions: [
        '这个知识点可以应用在你正在做的什么事情上？',
        '它和你已经知道的哪些东西有关联？',
        '如果要向一个完全不懂的人解释这个，你会怎么说？',
        '这个知识有没有一个让你意外的应用场景？',
      ],
      types: ['how', 'connect', 'expand', 'what_if'],
    },
    intuition: {
      questions: [
        '试着描述一下这个直觉：它像什么？给你什么感觉？',
        '如果反过来想，你觉得还成立吗？',
        '这个直觉有没有一个具体的例子可以支撑？',
        '你信任这个直觉的程度是1-10中的几？为什么？',
      ],
      types: ['expand', 'what_if', 'why', 'how'],
    },
  }

  const strategy = strategies[type]
  return strategy.questions.map((q, i) => ({
    id: generateId(),
    question: q,
    type: strategy.types[i],
    answered: false,
  }))
}

function evaluateValue(
  type: InspirationType,
  _content: string,
  answers: { question: string; answer: string }[]
): { level: JudgmentLevel; reasons: string[]; nextStep?: string } {
  const allText = _content + ' ' + answers.map((a) => a.answer).join(' ')
  const answerLengths = answers.map((a) => a.answer.length)
  const avgAnswerLength = answerLengths.reduce((a, b) => a + b, 0) / answers.length
  const enthusiasmWords = ['喜欢', '热爱', '擅长', '兴奋', '有趣', '想', '可以做', '我觉得', '一定', '肯定', '非常']
  const enthusiasmScore = enthusiasmWords.filter((w) => allText.includes(w)).length

  const score = enthusiasmScore * 2 + Math.min(avgAnswerLength / 10, 5)

  if (score >= 8) {
    return {
      level: 'cultivate',
      reasons: [
        '你在回答中表现出明显的热情和投入',
        '你的回答很具体，说明这个想法有实质内容',
        '你有相关的知识或经验可以支撑这个想法',
      ],
      nextStep: type === 'creative'
        ? '建议先写一个简要的规划大纲'
        : type === 'observation'
        ? '建议继续观察并记录相关现象'
        : '建议安排时间深入探索这个方向',
    }
  } else if (score >= 4) {
    return {
      level: 'incubate',
      reasons: [
        '这个想法有趣，但还需要更多信息或思考',
        '目前可能不是最佳时机，先放着观察',
        '可以在灵感池中随时回顾',
      ],
      nextStep: '不着急，等有新的灵感或信息再回来看',
    }
  } else {
    return {
      level: 'archive',
      reasons: [
        '目前这个想法还不够成熟',
        '从回答来看，可能不是你当前最关注的方向',
        '保留作为思维痕迹，以后可能会有新的启发',
      ],
    }
  }
}

export default function DeepeningChatPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const inspiration = useInspirationStore((s) => s.getById(id!))
  const update = useInspirationStore((s) => s.update)

  const [questions, setQuestions] = useState<DeepeningQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState<'questions' | 'judging' | 'result'>('questions')
  const [judgment, setJudgment] = useState<{ level: JudgmentLevel; reasons: string[]; nextStep?: string } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (inspiration && questions.length === 0) {
      setQuestions(generateQuestions(inspiration.inspirationType, inspiration.content))
    }
  }, [inspiration])

  if (!inspiration) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted">灵感不存在</p>
        <Link to="/inspiration" className="text-primary-600 text-sm mt-2 inline-block">返回列表</Link>
      </div>
    )
  }

  const allAnswered = questions.every((q) => answers[q.id]?.trim())

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answered: answer.trim().length > 0 } : q))
    )
  }

  const handleJudge = () => {
    setIsProcessing(true)
    setTimeout(() => {
      const answeredQuestions = questions.map((q) => ({
        question: q.question,
        answer: answers[q.id] || '',
      }))
      const result = evaluateValue(inspiration.inspirationType, inspiration.content, answeredQuestions)
      setJudgment(result)

      update(inspiration.id, {
        status: result.level === 'cultivate' ? 'cultivating' : result.level === 'archive' ? 'archived' : 'raw',
        valueJudgment: { ...result, judgedAt: now() },
        deepeningConversation: {
          questions,
          userAnswers: questions.map((q) => ({
            questionId: q.id,
            answer: answers[q.id] || '',
            answeredAt: now(),
          })),
          status: 'completed',
          startedAt: now(),
        },
      })

      setCurrentStep('result')
      setIsProcessing(false)
    }, 1200)
  }

  const handleSkip = () => {
    const result: { level: JudgmentLevel; reasons: string[]; nextStep?: string } = {
      level: 'incubate',
      reasons: ['你选择跳过深化，这个想法先放进灵感池'],
      nextStep: '随时可以回来继续深化',
    }
    setJudgment(result)
    update(inspiration.id, {
      status: 'raw',
      valueJudgment: { ...result, judgedAt: now() },
    })
    setCurrentStep('result')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">灵感深化</h1>
        <div className="w-8" />
      </div>

      <div className="card-paper border border-primary-100 p-4 mb-6">
        <p className="text-xs text-text-muted mb-1">你的原始想法</p>
        <p className="text-sm text-text-primary leading-relaxed">{inspiration.content}</p>
      </div>

      {currentStep === 'questions' && (
        <>
          <p className="text-sm text-text-secondary mb-3">
            绯绯想帮你把这个想法理得更清楚，回答这些问题：
          </p>
          <div className="space-y-4 mb-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="card-paper border border-primary-50 p-4">
                <p className="text-sm font-medium text-text-primary mb-2">
                  Q{idx + 1}. {q.question}
                </p>
                <textarea
                  placeholder="写下你的想法..."
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  rows={3}
                  className="w-full resize-none text-sm text-text-primary placeholder:text-text-muted bg-bg-secondary rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
                />
                <div className="text-right text-xs text-text-muted mt-1">
                  {(answers[q.id] || '').length} 字
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleJudge}
              disabled={!allAnswered || isProcessing}
              className="flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isProcessing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isProcessing ? '正在分析...' : '提交并让绯绯判断'}
            </button>
            <button
              onClick={handleSkip}
              className="py-2.5 text-text-muted text-sm hover:text-text-secondary transition-colors"
            >
              跳过，先放进灵感池
            </button>
          </div>
        </>
      )}

      {currentStep === 'result' && judgment && (
        <>
          <div className={`rounded-2xl border p-6 mb-6 ${ judgment.level === 'cultivate' ? 'bg-green-50/30 border-green-200' : judgment.level === 'incubate' ? 'bg-blue-50/30 border-blue-200' : 'bg-gray-50/30 border-gray-200' }`}>
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">
                {judgment.level === 'cultivate' ? '🌱' : judgment.level === 'incubate' ? '💤' : '🍃'}
              </div>
              <h2 className="text-xl font-semibold text-text-primary">
                {judgment.level === 'cultivate' ? '值得深挖！' :
                 judgment.level === 'incubate' ? '先养着吧' :
                 '只是个念头'}
              </h2>
            </div>

            <ul className="space-y-2 mb-4">
              {judgment.reasons.map((r, i) => (
                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            {judgment.nextStep && (
              <div className="bg-bg-card/80 rounded-xl p-3">
                <p className="text-sm text-primary-700 font-medium">
                  💡 {judgment.nextStep}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {judgment.level === 'cultivate' && (
              <Link
                to="/inspiration/cultivate"
                className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium text-sm hover:bg-green-600 transition-colors"
              >
                <Sprout size={16} />
                去培育区看看
              </Link>
            )}
            {judgment.level === 'incubate' && (
              <Link
                to="/inspiration/pool"
                className="flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl font-medium text-sm hover:bg-blue-600 transition-colors"
              >
                <Archive size={16} />
                去灵感池看看
              </Link>
            )}
            <Link
              to={`/inspiration/${inspiration.id}`}
              className="flex items-center justify-center gap-2 py-2.5 text-text-secondary text-sm hover:text-text-primary transition-colors"
            >
              查看灵感详情
            </Link>
            <Link
              to="/inspiration"
              className="flex items-center justify-center gap-2 py-2.5 text-text-muted text-sm hover:text-text-secondary transition-colors"
            >
              返回灵感列表
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
