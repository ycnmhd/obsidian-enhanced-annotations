export type Group = {
    pattern: string;
    color?: string;
    id: string;
};
export type Settings = {
    groups: Record<string, Group>;
    editorSuggest: {
        enableAutoSuggest: boolean;
        triggerPhrase: string;
    };
    parsing: {
        autoRegisterLabels: boolean;
    };
};
