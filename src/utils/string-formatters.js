import { MILLISECONDS } from '../constants/globals.js'

export function getDurationFromMilliseconds(milliseconds) {
  let remainingMilliseconds = parseInt(milliseconds)

  /**
   * @todo Correct how low times get floored by hours and minutes
   */

  const hours = Math.floor(remainingMilliseconds / MILLISECONDS.perHour)
  remainingMilliseconds -= hours * MILLISECONDS.perHour

  const minutes = Math.floor(remainingMilliseconds / MILLISECONDS.perMinute)
  remainingMilliseconds -= minutes * MILLISECONDS.perMinute

  const seconds = Math.floor(remainingMilliseconds / MILLISECONDS.perSecond)
  remainingMilliseconds -= seconds * MILLISECONDS.perSecond

  return {
    hours,
    minutes,
    seconds,
  }
}
