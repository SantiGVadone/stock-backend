export const SALT_ROUNDS = 10
export const ACCESS_TOKEN_EXPIRY = '15m'
export const REFRESH_TOKEN_EXPIRY = '7d'

export const parseDuration = (duration: string): number => {
  const match = duration.match(/^(\d+)([smhd])$/)
  if (!match) return 0
  const value = parseInt(match[1] ?? '0', 10)
  const unit = match[2] ?? 's'
  switch (unit) {
    case 's': return value * 1000
    case 'm': return value * 60 * 1000
    case 'h': return value * 60 * 60 * 1000
    case 'd': return value * 24 * 60 * 60 * 1000
    default: return 0
  }
}
