import { Drop, Item, Monster } from "@prisma/client";

interface DropWithItem extends Drop {
    item: Item;
}

export interface MonsterWithDropsAndItems extends Monster {
    drops: DropWithItem[];
}