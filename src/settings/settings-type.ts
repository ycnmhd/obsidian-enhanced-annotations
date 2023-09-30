export type Label = {
    label: string;
    color?: string;
    id: string;
    enableStyles: boolean;
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
    commands: {
        enableLabelCommands: boolean;
    };
};
