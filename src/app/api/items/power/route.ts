import { CATEGORY_MAPPING } from '@/app/constants/constants';
import { Effect } from '@/app/interfaces/item';
import { calculateItemPower } from '@/app/utils/item';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const levelParam = searchParams.get("level");
    const level = levelParam ? Number(levelParam) : 1;

    if (isNaN(level)) {
        return NextResponse.json({ error: 'Le paramètre level doit être un nombre.' }, { status: 400 });
    }

    const itemsEquipable = await prisma.item.findMany({
        where: { level: { lte: level } }
    });

    const equipmentsItems = itemsEquipable.filter((item) => {
        if (!item.categoryName) return false;
        return CATEGORY_MAPPING['Équipements'].includes(item.categoryName);
    });

    const itemsWithEffects = equipmentsItems.filter((item) => {
        if (!item.effects) return false;
        const effects = JSON.parse(item.effects as string);
        return effects.length > 0;
    });

    const itemsOrderedByPower = itemsWithEffects.sort((a, b) => {
        return calculateItemPower(b) - calculateItemPower(a);
    });

    // Extraire les caractéristiques uniques
    const uniqueCharacteristicsMap = new Map<string, { name: string; power: number }>();

    itemsOrderedByPower.forEach((item) => {
        if (item.effects) {
            const effects: Effect[] = JSON.parse(item.effects as string);
            effects.forEach((effect) => {
                // Utiliser une clé unique basée sur le nom de l'effet
                if (!uniqueCharacteristicsMap.has(effect.effect)) {
                    uniqueCharacteristicsMap.set(effect.effect, {
                        name: effect.effect,
                        power: effect.effectPowerRate ?? 1 // Utiliser 1 si effectPowerRate est undefined
                    });
                }
            });
        }
    });

    // Convertir la Map en tableau
    const uniqueCharacteristics = Array.from(uniqueCharacteristicsMap.values());

    return NextResponse.json({
        items: itemsOrderedByPower,
        characteristics: uniqueCharacteristics,
    });
}
