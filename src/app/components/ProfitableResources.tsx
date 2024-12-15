'use client';

import ListResourcesWithRentability from "./ListResourcesWithRentability";

export default function ProfitableResources() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Ressources les plus intéressantes à farmer</h1>
            <ListResourcesWithRentability />
        </div>
    );
}
