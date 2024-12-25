import React from 'react'
import { PROFESSIONS } from '../constants/constants';

interface ProfessionPickerProps {
    value: string;
    setProfession: (profession: string) => void;
}

export default function ProfessionPicker({ setProfession, value }: ProfessionPickerProps) {
    return (
        <div className="mb-8">
            <label className="block mb-2 font-semibold">Choisissez une profession :</label>
            <select
                value={value}
                onChange={(e) => setProfession(e.target.value)}
                className="border p-2 w-full mb-4"
            >
                <option value="">Toutes les professions</option>
                {PROFESSIONS.map((prof) => (
                    <option key={prof} value={prof}>
                        {prof}
                    </option>
                ))}
            </select>
        </div>
    )
}
