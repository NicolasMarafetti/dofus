import { calculateMosterTotalGain } from '@/app/utils/monster';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const minParam = searchParams.get("minLevel");
        const maxParam = searchParams.get("maxLevel");
        const minLevel = minParam ? parseInt(minParam) : 0;
        const maxLevel = maxParam ? parseInt(maxParam) : 200;

        const monsters = await prisma.monster.findMany({
            where: {
                level: {
                    gte: minLevel,
                    lte: maxLevel
                }
            },
            include: {
                drops: {
                    include: {
                        item: true
                    }
                }
            }
        });

        const monstersWithGain = monsters.map((monster) => {
            return {
                ...monster,
                averageGain: calculateMosterTotalGain(monster),
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
