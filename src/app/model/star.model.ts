interface StarModel {
    w: string;
    h: string;
    readonly: boolean;
    rate?: number;
    onChange?: (rating: number) => void;
}