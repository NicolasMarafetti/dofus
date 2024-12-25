import { Item, Job, JobIngredient } from "@prisma/client";

export interface JobIngredientWithItem extends JobIngredient {
    item: Item
}

export interface JobComplete extends Job {
    resultItem: Item;
    ingredients: JobIngredientWithItem[];
}