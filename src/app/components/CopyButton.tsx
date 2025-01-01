import React from 'react';

export default function CopyButton({ text }: { text: string }) {
    const removeAccents = (str: string) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const copyToClipboard = (text: string) => {
        const textWithoutAccents = removeAccents(text);
        navigator.clipboard.writeText(textWithoutAccents);
    };

    return (
        <button
            onClick={() => copyToClipboard(text)}
            title="Copier le nom"
            className="p-1 text-gray-600 border rounded hover:bg-gray-100"
        >
            📋
        </button>
    );
}
