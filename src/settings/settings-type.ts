export type LabelStyle = {
    color?: string;
    italic?: boolean;
    bold?: boolean;
    underline?: boolean;
    fontSize?: number;
    case?: 'upper' | 'lower' | 'title' | 'unset';
};
export type Label = {
    label: string;
    id: string;
    style: LabelStyle;
    enableStyle: boolean;
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
