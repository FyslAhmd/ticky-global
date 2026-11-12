/** Convert a date+time expressed in one IANA zone to a friendly string in another. */
export function convertToZone(dateISO: string, timeHM: string, fromTz: string, toTz: string): string | null {
  try {
    const guessUtc = new Date(`${dateISO}T${timeHM}:00Z`)
    const dtf = new Intl.DateTimeFormat('en-GB', {
      timeZone: fromTz, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    })
    let ts = guessUtc.getTime()
    for (let i = 0; i < 2; i++) {
      const parts = dtf.formatToParts(new Date(ts))
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
      const asIfUtc = Date.UTC(Number(get('year')), Number(get('month')) - 1, Number(get('day')), Number(get('hour')), Number(get('minute')))
      ts += guessUtc.getTime() - asIfUtc
    }
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: toTz, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
    }).format(new Date(ts))
  } catch {
    return null
  }
}
