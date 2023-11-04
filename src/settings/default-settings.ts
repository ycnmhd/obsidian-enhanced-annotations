import { Settings } from './settings-type';

export const DEFAULT_SETTINGS = (): Settings => ({
    editorSuggest: {
        enableAutoSuggest: true,
        triggerPhrase: '//',
        commentType: 'html',
    },
    decoration: {
        autoRegisterLabels: true,
        decorateCommentTags: true,
        styles: {
            labels: {},
            tag: {
                style: { fontSize: 10, opacity: 40 },
                enableStyle: true,
            },
        },
    },
    commands: {
        enableLabelCommands: false,
    },
    outline: {
        fontSize: 12,
        showLabelsFilter: false,
        showSearchInput: false,
        hiddenLabels: [],
        hiddenCategories: [],
    },
    tts: {
        rate: 1.1,
        pitch: 1.0,
        volume: 1,
        voice: window.speechSynthesis.getVoices().find((v) => v.default)?.name,
        focusAnnotationInEditor: true,
    },
    notes: {
        defaultFolder: 'notes',
        notesNamingMode: 'label/annotation',
        openNoteAfterCreation: false,
        insertLinkToNote: true,
        defaultFolderMode: 'current folder/notes',
        template: `#annotation/{{label}}\n\n{{content}}`,
    },
});
