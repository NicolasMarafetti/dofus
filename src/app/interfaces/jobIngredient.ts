import { Item, JobIngredient } from "@prisma/client";

export interface IngredientWithItem extends JobIngredient {
    item: Item;
}

export interface GroupedResource {
    id: string;
    price: number;
    quantity: number;
    totalCost: number;
    item: Item;
}