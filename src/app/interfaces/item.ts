export interface Effect {
    from: number;
    to: number;
    effect: string;
    effectPowerRate: number;
}

export interface ItemFromApiWhenTakingAllItems {
    id: number;
    craftVisible: boolean;
    hasRecipe: boolean;
    level: number;
    name: {
        fr: string;
    }
}