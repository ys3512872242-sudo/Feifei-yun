import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { usePeopleStore } from '../../features/people/store'
import type { RelationshipType } from '../../core/types'

const relationshipLabels: Record<RelationshipType, string> = {
  family: '家人', close_friend: '密友', friend: '朋友',
  classmate: '同学', teacher: '老师', colleague: '同事',
  acquaintance: '认识的人', other: '其他',
}

const relationshipColors: Record<RelationshipType, string> = {
  family: '#af7a3c',
  close_friend: '#cd9f5f',
  friend: '#d8b378',
  classmate: '#8fa89a',
  teacher: '#5a7468',
  colleague: '#a5b9ab',
  acquaintance: '#b3a996',
  other: '#7a6f5d',
}

export default function RelationshipGraphPage() {
  const people = usePeopleStore((s) => s.people)
  const interactions = usePeopleStore((s) => s.interactions)

  // 简单的关系图谱：以"你"为中心，人物围绕排列
  const centerX = 150
  const centerY = 150
  const radius = 110

  const peopleWithAngles = people.map((p, i) => {
    const angle = (2 * Math.PI * i) / Math.max(people.length, 1) - Math.PI / 2
    return {
      ...p,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  // 计算互动连线
  const interactionLines = interactions.slice(0, 50).map((int) => {
    const person = people.find((p) => p.id === int.personId)
    if (!person) return null
    const node = peopleWithAngles.find((n) => n.id === int.personId)
    if (!node) return null
    return {
      id: int.id,
      x1: centerX,
      y1: centerY,
      x2: node.x,
      y2: node.y,
      isVent: int.isVent,
    }
  }).filter(Boolean)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/people" className="p-2 -ml-2 rounded-xl hover:bg-bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">关系图谱</h1>
          <p className="text-xs text-text-muted">你的世界网络</p>
        </div>
      </div>

      {people.length === 0 ? (
        <div className="text-center py-16 card-paper border border-dashed border-primary-200">
          <div className="text-5xl mb-4">🕸️</div>
          <p className="text-text-secondary mb-3">还没有添加任何人</p>
          <Link
            to="/people/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium"
          >
            添加第一个联系人
          </Link>
        </div>
      ) : (
        <div className="card-paper border border-primary-100 p-4">
          <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
            {/* 连线 */}
            {interactionLines.map((line) =>
              line ? (
                <line
                  key={line.id}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={line.isVent ? '#f97316' : '#e5e0d8'}
                  strokeWidth={line.isVent ? 1.5 : 0.8}
                  strokeDasharray={line.isVent ? '4 2' : 'none'}
                  opacity={0.6}
                />
              ) : null
            )}

            {/* 中心节点：你 */}
            <circle cx={centerX} cy={centerY} r={22} fill="#c9944f" opacity={0.15} />
            <circle cx={centerX} cy={centerY} r={18} fill="#c9944f" opacity={0.3} />
            <circle cx={centerX} cy={centerY} r={14} fill="#c9944f" />
            <text x={centerX} y={centerY + 5} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
              你
            </text>

            {/* 人物节点 */}
            {peopleWithAngles.map((p) => (
              <g key={p.id}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={14}
                  fill={relationshipColors[p.relationship]}
                  opacity={0.15}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={12}
                  fill={relationshipColors[p.relationship]}
                  opacity={0.8}
                />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                >
                  {p.name.length > 3 ? p.name.slice(0, 3) + '..' : p.name}
                </text>
              </g>
            ))}
          </svg>

          {/* 图例 */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-primary-50">
            {Object.entries(relationshipLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: relationshipColors[key as RelationshipType] }}
                />
                <span className="text-xs text-text-muted">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-px bg-[#e5e0d8]" />
              <span className="text-xs text-text-muted">普通互动</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-px border-t border-dashed border-orange-400" />
              <span className="text-xs text-text-muted">吐槽</span>
            </div>
          </div>
        </div>
      )}

      {/* 统计 */}
      {people.length > 0 && (
        <div className="mt-6 card-paper border border-primary-50 p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">📊 关系概览</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-secondary rounded-xl p-3 text-center">
              <p className="text-2xl font-semibold text-text-primary">{people.length}</p>
              <p className="text-xs text-text-muted">联系人</p>
            </div>
            <div className="bg-bg-secondary rounded-xl p-3 text-center">
              <p className="text-2xl font-semibold text-text-primary">{interactions.length}</p>
              <p className="text-xs text-text-muted">互动记录</p>
            </div>
            <div className="bg-bg-secondary rounded-xl p-3 text-center">
              <p className="text-2xl font-semibold text-orange-500">
                {interactions.filter((i) => i.isVent).length}
              </p>
              <p className="text-xs text-text-muted">吐槽次数</p>
            </div>
            <div className="bg-bg-secondary rounded-xl p-3 text-center">
              <p className="text-2xl font-semibold text-primary-500">
                {Math.round(people.reduce((a, p) => a + p.intimacy, 0) / Math.max(people.length, 1) * 10) / 10}
              </p>
              <p className="text-xs text-text-muted">平均亲密度</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
