import { Settings } from './settings-type';

export const DEFAULT_SETTINGS: Settings = {
    labels: {},
    editorSuggest: {
        enableAutoSuggest: true,
        triggerPhrase: '//',
    },
    parsing: {
        autoRegisterLabels: true,
    },
    commands: {
        enableLabelCommands: false,
    },
    outline: {
        fontSize: 12,
        showLabelsFilter: false,
        showSearchInput: false,
        hiddenLabels: [],
    },
};
