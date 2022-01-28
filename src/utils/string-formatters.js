import { MILLISECONDS } from '../constants/globals.js'

/**
 * Returns formatted duration string from milliseconds.
 */
export function getDurationFromMilliseconds(milliseconds) {
  let ms = parseInt(milliseconds)

  if (!ms || ms < 1000) {
    return '-'
  }

  let seconds = Math.floor((ms / MILLISECONDS.perSecond) % 60)
  let minutes = Math.floor((ms / MILLISECONDS.perMinute) % 60)
  let hours = Math.floor((ms / MILLISECONDS.perHour) % 24)

  hours = hours > 0 ? `${hours}h ` : ''
  minutes = minutes > 0 ? `${minutes}m ` : ''
  seconds = seconds > 0 ? `${seconds}s ` : ''

  return `${hours}${minutes}${seconds}`
}
