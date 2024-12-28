export function calculateCraftExp(itemLevel: number): number {
    return itemLevel * 20;
}

export function calculateXpGained(levelRequired: number, currentLevel: number): number {
    const baseXp = levelRequired * 20;

    const k = 0.0657; // Nouveau facteur basé sur vos données
    const reductionFactor = Math.max(0, 1 - (currentLevel - levelRequired) * k);
    return Math.floor(baseXp * reductionFactor);
}
