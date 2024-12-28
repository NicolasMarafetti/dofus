import React, { useState } from 'react'

interface RécupérationDesObjetsProps {
    error: string | null;
    fetchItemsFromApi: (e: React.FormEvent) => void;
    forceUpdate: boolean;
    loading: boolean;
    maxLevel: string;
    minLevel: string;
    setForceUpdate: (value: boolean) => void;
    setMaxLevel: (value: string) => void;
    setMinLevel: (value: string) => void;
}

export default function RécupérationDesObjets({ error, fetchItemsFromApi, forceUpdate, loading, maxLevel, minLevel, setForceUpdate, setMaxLevel, setMinLevel }: RécupérationDesObjetsProps) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <form onSubmit={fetchItemsFromApi} className="space-y-4 p-6 bg-white shadow-md rounded-md">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Niveau Minimum :</label>
                        <input
                            type="number"
                            value={minLevel}
                            onChange={(e) => setMinLevel(e.target.value)}
                            placeholder="Ex : 1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Niveau Maximum :</label>
                        <input
                            type="number"
                            value={maxLevel}
                            onChange={(e) => setMaxLevel(e.target.value)}
                            placeholder="Ex : 200"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="forceUpdate"
                        checked={forceUpdate}
                        onChange={(e) => setForceUpdate(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                        value={forceUpdate ? 'true' : 'false'}
                    />
                    <label htmlFor="forceUpdate" className="text-sm text-gray-700">
                        Forcer la récupération même si les objets existent déjà
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition"
                    disabled={loading}
                >
                    {loading ? 'Chargement...' : 'Récupérer les objets'}
                </button>
            </form>

            {loading && <p className="text-center text-blue-500 mt-4">Chargement...</p>}
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        </div>
    )
}
