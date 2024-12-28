import { MonsterWithDropsAndItems } from "../interfaces/monster";

export const calculateMosterTotalGain = (monster: MonsterWithDropsAndItems): number => {
    let totalGain = 0;

    monster.drops.forEach((drop) => {
        if (drop.item && drop.dropRate) {
            // Calcule le prix le plus élevé par unité
            const pricePerUnit = Math.max(
                drop.item.price1 || 0,
                drop.item.price10 ? drop.item.price10 / 10 : 0,
                drop.item.price100 ? drop.item.price100 / 100 : 0
            );

            // Ajoute le gain au total en fonction du taux de drop
            totalGain += pricePerUnit * (drop.dropRate / 100);
        }
    });

    // Taux d'apparition des protecteurs: 2.5%.
    if(monster.name.includes("Dévoreur")) {
        totalGain *= 0.025;
    }

    return totalGain;
}