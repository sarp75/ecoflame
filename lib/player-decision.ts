export interface PlayerInputs {
  id: string;
  level: number;
  skill: number;
  habitScore: number;
  boredomThreshold?: number;
  motivation?: number;
}

export interface QuestInputs {
  id: string;
  reward: number;
  difficulty: number;
}

export interface DecisionResult {
  probability: number;
  perceivedDifficulty: number;
  flowRatio: number;
  utility: number;
  flowWarning?: string;
}

const defaultBoredomThreshold = 2.0;

export function evaluateDecision(
  player: PlayerInputs,
  quest: QuestInputs,
): DecisionResult {
  const motivation =
    player.motivation !== undefined ? player.motivation : Math.random() * 0.8 + 0.1;
  const boredomThreshold = player.boredomThreshold ?? defaultBoredomThreshold;

  const perceivedDifficulty = quest.difficulty / Math.max(1, player.skill * 0.1);
  const flowRatio = quest.difficulty === 0 ? Infinity : player.skill / quest.difficulty;

  const utility = motivation * quest.reward + player.habitScore * 0.5 - perceivedDifficulty;
  const probability = 1 / (1 + Math.exp(-(utility - 0.5)));

  const flowWarning =
    flowRatio > boredomThreshold
      ? `Oyuncu ${player.id} sıkıldı! Daha zor görev verilmeli.`
      : undefined;

  return { probability, perceivedDifficulty, flowRatio, utility, flowWarning };
}

