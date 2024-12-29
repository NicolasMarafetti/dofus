import { Item } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

interface ItemImageProps {
    item: Item
}

export default function ItemImage({ item }: ItemImageProps) {
    return (
        <Image alt={item.name} src={item.image} height={75} width={75} />
    )
}
