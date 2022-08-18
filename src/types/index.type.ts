export interface DataTypes {
    type: {
        name: string
    }
}
export interface DataResponse {
    id: number;
    name: string;
    height: number;
    weight: number;
    urlImage: string;
    color: string;
    types: DataTypes[]
}