import { PrismaClient } from "@prisma/client";
import { MonsterWithDropsAndItems } from "../interfaces/monster";

const prisma = new PrismaClient();

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
    if (monster.name.includes("Dévoreur")) {
        totalGain *= 0.025;
    }

    // Taux d'apparition des Créatures Archimonstres: 1 chance sur 1000
    if(monster.isMiniBoss) {
        totalGain *= 0.001;
    }

    // Boss de donjons, en moyenne il y a 25 monstres
    if(monster.isDungeonBoss) {
        totalGain /= 25; 
    }

    return totalGain;
}

export const checkMonstersAreMiniBoss = async () => {
    const monsters = await prisma.monster.findMany();

    for (const monster of monsters) {

        if(monster.monsterDofusdbId !== 2277) continue;

        const monsterData = await fetchMonsterDetails(monster.monsterDofusdbId);

        if (!monsterData) {
            console.error(`Monster ${monster.monsterDofusdbId} not found`);
            continue;
        }

        await prisma.monster.update({
            where: { id: monster.id },
            data: { isMiniBoss: monsterData.isMiniBoss }
        });
    }
}

// Fonction pour récupérer les détails des monstres
export const fetchMonsterDetails = async (monsterId: number) => {
    const url = `https://api.dofusdb.fr/monsters/${monsterId}?lang=fr`;

    const response = await fetch(url);
    const data: {
        id: number;
        name: {
            fr: string;
        };
        isBoss: boolean;
        isMiniBoss: boolean;
        img: string;
        drops: {
            objectId: number;
            percentDropForGrade1: number;
        }[];
        grades: {
            level: number
        }[];
    } = await response.json();

    return data || null;
};

// Fonction pour récupérer les détails des monstres
export const fetchMonstersDetails = async (monsterIds: number[]) => {
    const monsterIdsQuery = monsterIds.map(id => `id[$in][]=${id}`).join('&');
    const url = `https://api.dofusdb.fr/monsters?$limit=50&${monsterIdsQuery}&lang=fr`;

    const response = await fetch(url);
    const data: {
        data: {
            id: number;
            name: {
                fr: string;
            };
            isBoss: boolean;
            isMiniBoss: boolean;
            img: string;
            drops: {
                objectId: number;
                percentDropForGrade1: number;
            }[];
            grades: {
                level: number
            }[];
        }[];
    } = await response.json();

    return data?.data || [];
};
