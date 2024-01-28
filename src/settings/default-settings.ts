import { Settings } from './settings-type';
import { copiedAnnotationsTemplates } from '../clipboard/helpers/annotations-to-text';
import { noteTemplate } from '../note-creation/create-note-file';

export const DEFAULT_SETTINGS = (): Settings => ({
    editorSuggest: {
        enableAutoSuggest: true,
        triggerPhrase: '//',
        commentFormat: 'html',
    },
    decoration: {
        autoRegisterLabels: true,
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
        assignHotkeys: false,
    },
    outline: {
        fontSize: 12,
        showLabelsFilter: false,
        showSearchInput: false,
        hiddenLabels: [],
        hiddenTypes: [],
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
        notesNamingMode: 'annotation-label/annotation-text',
        openNoteAfterCreation: false,
        insertLinkToNote: true,
        defaultFolderMode: 'current folder/notes',
        template: noteTemplate,
        truncateFileName: false,
    },
    idling: {
        daysUnused: [],
    },
    clipboard: {
        templates: copiedAnnotationsTemplates,
    },
});
