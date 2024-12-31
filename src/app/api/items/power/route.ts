import { CATEGORY_MAPPING } from '@/app/constants/constants';
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
        if(!item.categoryName) return false;
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

    return NextResponse.json({ items: itemsOrderedByPower });
}
