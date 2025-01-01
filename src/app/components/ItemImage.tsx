import { Item } from '@prisma/client'
import React, { useMemo } from 'react'

interface ItemImageProps {
    item: Item
    size?: string
}

export default function ItemImage({ item, size }: ItemImageProps) {
    const sizeClass = useMemo(() => {
        if (size === 'small') return 'h-10 w-10'
        if (size === 'medium') return 'h-20 w-20'
        if (size === 'large') return 'h-40 w-40'
        return 'h-12 w-12'
    }, [size])

    return (
        <img alt={item.name} src={item.image} className={sizeClass} />
    )
}
