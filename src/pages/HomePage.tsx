import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, Check, Lightbulb, MoonStar, Plus, ScanFace } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useInspirationStore } from '../features/inspiration/store'
import { formatRelative } from '../shared/lib'

export default function HomePage() {
  const inspirations = useInspirationStore((state) => state.inspirations)
  const addInspiration = useInspirationStore((state) => state.add)
  const [draft, setDraft] = useState('')
  const [saved, setSaved] = useState(false)
  const recentInspirations = inspirations.slice(0, 3)

  const handleQuickCapture = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = draft.trim()
    if (!content) return
    addInspiration({ content })
    setDraft('')
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="workbench-page">
      <header className="workbench-hero">
        <div className="workbench-intro">
          <p className="date-label">
            {new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date())}
          </p>
          <p className="workbench-kicker">绯绯 · 我的工作台</p>
          <h1>先在这里，<br />安放今天。</h1>
          <p className="workbench-lead">不急着成为更好的人。先留下真实的感受，再慢慢看清自己。</p>
        </div>
        <figure className="hero-art" aria-label="抽象的窗、光与书桌">
          <div className="hero-window" aria-hidden="true"><i /><i /><i /></div>
          <div className="hero-sun" aria-hidden="true" />
          <div className="hero-table" aria-hidden="true" />
          <div className="hero-vase" aria-hidden="true"><i /><i /></div>
          <div className="hero-paper" aria-hidden="true" />
        </figure>
      </header>

      <section className="capture-panel" aria-labelledby="capture-title">
        <div className="capture-heading">
          <div>
            <span>01</span>
            <h2 id="capture-title">此刻想到什么？</h2>
          </div>
          <p>半句话也可以。</p>
        </div>

        <form className="quick-capture" onSubmit={handleQuickCapture}>
          <label htmlFor="quick-inspiration" className="sr-only">记录碎片灵感</label>
          <Lightbulb size={18} strokeWidth={1.5} aria-hidden="true" />
          <input
            id="quick-inspiration"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="刚刚想到……"
            autoComplete="off"
          />
          <button type="submit" className="quick-capture-button" disabled={!draft.trim()}>
            <Plus size={16} />
            收好
          </button>
        </form>
        <div className={`capture-feedback ${saved ? 'is-visible' : ''}`} role="status" aria-live="polite">
          <Check size={15} /> 已收进灵感里
        </div>
      </section>

      <section className="workbench-section" aria-labelledby="workbench-title">
        <div className="workbench-section-heading">
          <div>
            <span>02</span>
            <h2 id="workbench-title">接下来，想去哪里？</h2>
          </div>
          <p>三件事，各自安静地发生。</p>
        </div>

        <div className="workbench-paths">
          <Link to="/inspiration" className="path-card path-inspiration">
            <div className="path-art art-inspiration" aria-hidden="true">
              <i /><i /><i />
              <span />
            </div>
            <div className="path-copy">
              <span className="path-number">A · 碎片</span>
              <Lightbulb size={18} strokeWidth={1.5} />
              <h3>灵感</h3>
              <p>{inspirations.length > 0 ? `${inspirations.length} 条想法正在这里生长。` : '把突然闪过的念头先放进来。'}</p>
              <em>进入灵感 <ArrowRight size={14} /></em>
            </div>
          </Link>

          <Link to="/discovery" className="path-card path-self">
            <div className="path-art art-self" aria-hidden="true">
              <i /><i /><i />
              <span />
            </div>
            <div className="path-copy">
              <span className="path-number">B · 线索</span>
              <ScanFace size={18} strokeWidth={1.5} />
              <h3>认识自己</h3>
              <p>从真实记录里，看见优点、消耗与反复出现的模式。</p>
              <em>查看我的线索 <ArrowRight size={14} /></em>
            </div>
          </Link>

          <Link to="/mysticism" className="path-card path-mysticism">
            <div className="path-moon" aria-hidden="true"><i /></div>
            <div className="path-copy">
              <span className="path-number">C · 探问</span>
              <MoonStar size={18} strokeWidth={1.5} />
              <h3>玄学</h3>
              <p>独立而认真地探问八字与塔罗，不混入日常记录。</p>
              <em>进入玄学 <ArrowRight size={14} /></em>
            </div>
          </Link>
        </div>
      </section>

      <section className="recent-desk" aria-labelledby="recent-title">
        <div className="recent-desk-heading">
          <div>
            <span>03</span>
            <h2 id="recent-title">最近放在桌上的</h2>
          </div>
          <Link to="/inspiration">全部记录 <ArrowRight size={14} /></Link>
        </div>

        {recentInspirations.length === 0 ? (
          <div className="desk-empty">
            <span className="empty-line" />
            <p>桌面还是空的。第一条记录不需要完整。</p>
          </div>
        ) : (
          <div className="desk-notes">
            {recentInspirations.map((item, index) => (
              <Link key={item.id} to={`/inspiration/${item.id}`} className="desk-note">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item.content}</p>
                <time>{formatRelative(item.createdAt)}</time>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
