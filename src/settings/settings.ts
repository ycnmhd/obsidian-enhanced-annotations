export type Group = {
    pattern: string;
    color?: string;
    id: string;
};
export type Settings = {
    groups: Record<string, Group>;
};

export const DEFAULT_SETTINGS: Settings = {
    groups: {},
};
