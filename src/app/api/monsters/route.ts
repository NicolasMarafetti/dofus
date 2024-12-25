import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const monsters = await prisma.monster.findMany({
            include: {
                drops: {
                    include: {
                        item: true
                    }
                }
            }
        });

        const monstersWithGain = monsters.map((monster) => {
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

            return {
                id: monster.id,
                monsterDofusdbId: monster.monsterDofusdbId,
                name: monster.name,
                level: monster.level,
                isDungeonBoss: monster.isDungeonBoss,
                img: monster.img,
                averageGain: totalGain,
                drops: monster.drops.map((drop) => ({
                    id: drop.item?.id,
                    name: drop.item?.name,
                    dropRate: drop.dropRate,
                    price1: drop.item?.price1,
                    price10: drop.item?.price10,
                    price100: drop.item?.price100
                }))
            };
        });

        return NextResponse.json(monstersWithGain);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des monstres.' }, { status: 500 });
    }
}
