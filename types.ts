export enum Page {
    LOGIN = 'LOGIN',
    DASHBOARD = 'DASHBOARD',
    SCAN = 'SCAN',
    PROFILE = 'PROFILE',
    SETTINGS = 'SETTINGS',
    TIER = 'TIER',
}

export enum GarbageType {
    PLASTIC_BOTTLE = 'PLASTIC_BOTTLE',
    PLASTIC_WRAPPER_BAG = 'PLASTIC_WRAPPER_BAG',
    GLASS_BOTTLE = 'GLASS_BOTTLE',
    PAPER_CARDBOARD = 'PAPER_CARDBOARD',
    METAL_SCRAP = 'METAL_SCRAP',
    BIODEGRADABLE = 'BIODEGRADABLE',
    STYROFOAM = 'STYROFOAM',
    GENERAL_WASTE = 'GENERAL_WASTE',
}

export interface ScannedItem {
    id: string;
    name: string;
    type: GarbageType;
    points: number;
    image: string; // base64 data URL
    timestamp: Date;
}