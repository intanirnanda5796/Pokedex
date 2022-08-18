export interface StatsType {
    name: string;
    base_stat: number
    stat: {
        name: string
    }
}
export interface AbilityType {
    ability: string;
}

export interface TypesType {
    type: {
        name: string;
    };
}

export interface DetailResponse {
    name: string;
    urlImage: string;
    description: string;
    stats: StatsType[];
    abilities: AbilityType[];
    types: TypesType[];
}