// Gets the start of a date
export function startOfDay (date) {
  let d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// Gets the very end of a date
export function endOfDay (date) {
  let d = new Date(date)
  d.setHours(23, 59, 59, 0)
  return d
}

// Returns today - n number of days
export function previousNDays (days) {
  let d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

/*
 * @vue/component
 * A mixin for components that need to handle dates
 */
export default {
  methods: { startOfDay, endOfDay, previousNDays }
}
