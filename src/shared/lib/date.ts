import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(date: number | string): string {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date)
  if (isToday(d)) return '今天'
  if (isYesterday(d)) return '昨天'
  return format(d, 'M月d日', { locale: zhCN })
}

export function formatDateTime(date: number | string): string {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date)
  return format(d, 'yyyy年M月d日 HH:mm', { locale: zhCN })
}

export function formatRelative(date: number | string): string {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date)
  return formatDistanceToNow(d, { addSuffix: true, locale: zhCN })
}

export function getDateKey(date?: Date): string {
  const d = date || new Date()
  return format(d, 'yyyy-MM-dd')
}

export function now(): number {
  return Date.now()
}
