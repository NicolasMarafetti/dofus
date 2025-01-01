export function calculateCraftExp(itemLevel: number): number {
    return itemLevel * 20;
}

export function calculateXpGained(levelRequired: number, currentLevel: number, profession: string): number {
    const professionMultiplier = profession === "Chasseur" ? 2 : 20;

    const baseXp = Math.max(20, levelRequired * professionMultiplier);

    const k = profession === "Chasseur" ? 0.0657 : 0.0657; // Nouveau facteur basé sur vos données
    const reductionFactor = Math.max(0, 1 - (currentLevel - levelRequired) * k);

    return Math.floor(baseXp * reductionFactor);
}
