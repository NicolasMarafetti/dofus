import { IngredientWithItem } from "./jobIngredient";

export interface GroupedCraftPlan {
    craftId: string;
    name: string;
    level: number;
    experience: number;
    cost: number;
    quantity: number;
    ingredients: IngredientWithItem[];
}