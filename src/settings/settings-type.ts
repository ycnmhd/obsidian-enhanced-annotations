export type Label = {
    pattern: string;
    color?: string;
    id: string;
    enableCommand: boolean;
};
export type Settings = {
    labels: Record<string, Label>;
    editorSuggest: {
        enableAutoSuggest: boolean;
        triggerPhrase: string;
    };
    parsing: {
        autoRegisterLabels: boolean;
    };
};
