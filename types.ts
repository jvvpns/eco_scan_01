export enum Page {
    LOGIN = 'LOGIN',
    DASHBOARD = 'DASHBOARD',
    SCAN = 'SCAN',
    PROFILE = 'PROFILE',
    SETTINGS = 'SETTINGS',
    TIER = 'TIER',
}

export enum GarbageType {
    SPECIAL = 'Special',
    NON_BIODEGRADABLE = 'Non-Biodegradable',
    BIODEGRADABLE = 'Biodegradable',
    RESIDUAL = 'Residual',
}

export interface ScannedItem {
    id: string;
    name: string;
    type: GarbageType;
    points: number;
    image: string; // base64 data URL
    timestamp: Date;
}