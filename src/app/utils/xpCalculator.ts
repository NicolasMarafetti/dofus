export function calculateXpGained(baseXp: number, levelRequired: number, currentLevel: number): number {

    console.log("calculateXpGained");
    console.log("baseXp: ", baseXp);
    console.log("levelRequired: ", levelRequired);
    console.log("currentLevel: ", currentLevel);

    const reductionFactor = Math.max(0, 1 - (currentLevel - levelRequired) / 100);
    return Math.floor(baseXp * reductionFactor); // XP arrondie à l'entier inférieur
}
