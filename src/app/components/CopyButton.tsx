import React from 'react'

export default function CopyButton({ text }: { text: string }) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <button
            onClick={() => copyToClipboard(text)}
            title="Copier le nom"
            className="p-1 text-gray-600 border rounded hover:bg-gray-100"
        >
            📋
        </button>
    )
}
