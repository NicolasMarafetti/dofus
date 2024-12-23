import React, { useState } from 'react'

interface GetCraftsProps {
    onCraftUpdated: () => void;
    profession: string;
}

export default function GetCrafts({ onCraftUpdated, profession }: GetCraftsProps) {
    const [minLevel, setMinLevel] = useState<string>('');
    const [maxLevel, setMaxLevel] = useState<string>('');

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        await fetch(`/api/jobs`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                profession,
                minLevel,
                maxLevel
            })
        });
    
        onCraftUpdated();
    }

    return (
        <div>
            <h2>Récupération des crafts</h2>
            <form
                onSubmit={onFormSubmit}
                className="space-y-4"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Niveau minimum :</label>
                        <input
                            type="number"
                            value={minLevel}
                            onChange={(e) => setMinLevel(e.target.value)}
                            placeholder="Ex : 0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Niveau maximum :</label>
                        <input
                            type="number"
                            value={maxLevel}
                            onChange={(e) => setMaxLevel(e.target.value)}
                            placeholder="Ex : 200"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition"
                >
                    Récupérer les objets
                </button>
            </form>
        </div>
    )
}
