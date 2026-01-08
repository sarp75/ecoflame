export function xpToLevel(xp: number) {
  return Math.floor(xp / 40);
}

export function dragonPowerScore(xp: number, coins: number) {
  return xpToLevel(xp) * 100 + coins;
}

