import { getItemMinPrice } from "./item";
import { JobComplete } from "../interfaces/job";

export const calculateCraftCost = (job: JobComplete) => {
    let craftCost = 0;

    for (const ingredient of job.ingredients) {
        const itemMinPrice = getItemMinPrice(ingredient.item);

        craftCost += itemMinPrice * ingredient.quantity;
    }

    return craftCost;
}
