import {
    CommentType,
    DefaultFolderMode,
    NotesNamingMode,
    Settings,
} from './settings-type';
import { getDefaultColor } from './helpers/get-default-color';
import { isValidLabel } from '../helpers/is-valid-label';

export type SettingsActions =
    | {
          type: 'SET_PATTERN';
          payload: {
              id: string;
              pattern: string;
          };
      }
    | {
          type: 'SET_COLOR';
          payload: {
              id: string;
              color: string;
          };
      }
    | {
          type: 'DELETE_GROUP';
          payload: {
              id: string;
          };
      }
    | {
          type: 'NEW_GROUP';
          payload: {
              pattern: string;
          };
      }
    | { type: 'ENABLE_AUTO_SUGGEST'; payload: { enable: boolean } }
    | { type: 'SET_AUTO_SUGGEST_TRIGGER'; payload: { trigger: string } }
    | { type: 'ENABLE_AUTO_REGISTER_LABELS'; payload: { enable: boolean } }
    | {
          type: 'ENABLE_DECORATE_COMMENT_TAGS';
          payload: { enable: boolean };
      }
    | {
          type: 'ENABLE_LABEL_STYLES';
          payload: { id: string; enable: boolean };
      }
    | {
          type: 'SET_LABEL_UNDERLINE';
          payload: {
              id: string;
              underline: boolean;
          };
      }
    | {
          type: 'SET_LABEL_BOLD';
          payload: {
              id: string;
              bold: boolean;
          };
      }
    | {
          type: 'SET_LABEL_FONT_SIZE';
          payload: {
              id: string;
              fontSize: string;
          };
      }
    | {
          type: 'SET_LABEL_ITALIC';
          payload: {
              id: string;
              italic: boolean;
          };
      }
    | {
          type: 'TOGGLE_LABEL_CASE';
          payload: {
              id: string;
          };
      }
    | { type: 'SET_TTS_VOLUME'; payload: { volume: number } }
    | { type: 'SET_TTS_RATE'; payload: { rate: number } }
    | { type: 'SET_TTS_PITCH'; payload: { pitch: number } }
    | { type: 'SET_TTS_VOICE'; payload: { voice: string } }
    | { type: 'SET_NOTES_FOLDER'; payload: { folder: string } }
    | { type: 'SET_NOTES_FOLDER_MODE'; payload: { mode: DefaultFolderMode } }
    | { type: 'SET_NOTES_TEMPLATE'; payload: { template: string } }
    | { type: 'SET_NOTES_NAMING_MODE'; payload: { folder: NotesNamingMode } }
    | { type: 'SET_NOTES_OPEN_AFTER_CREATION'; payload: { open: boolean } }
    | { type: 'SET_NOTES_INSERT_LINK_TO_NOTE'; payload: { insert: boolean } }
    | {
          type: 'SET_AUTO_SUGGEST_COMMENT_TYPE';
          payload: { type: CommentType };
      };
export const settingsReducer = (
    store: Settings,
    action: SettingsActions,
): Settings => {
    store = JSON.parse(JSON.stringify(store));
    if (action.type === 'SET_PATTERN') {
        if (isValidLabel(action.payload.pattern))
            store.labels[action.payload.id].label = action.payload.pattern;
    } else if (action.type === 'SET_COLOR') {
        store.labels[action.payload.id].style.color = action.payload.color;
    } else if (action.type === 'DELETE_GROUP') {
        delete store.labels[action.payload.id];
    } else if (action.type === 'NEW_GROUP') {
        if (!action.payload.pattern || isValidLabel(action.payload.pattern)) {
            const id = String(Date.now());
            store.labels[id] = {
                label: action.payload.pattern,
                id,
                enableStyle: true,
                style: {
                    color: getDefaultColor(Object.values(store.labels))?.hex,
                },
            };
        }
    } else if (action.type === 'ENABLE_AUTO_SUGGEST') {
        store.editorSuggest.enableAutoSuggest = action.payload.enable;
    } else if (action.type === 'SET_AUTO_SUGGEST_TRIGGER') {
        if (action.payload.trigger)
            store.editorSuggest.triggerPhrase = action.payload.trigger;
    } else if (action.type === 'ENABLE_AUTO_REGISTER_LABELS') {
        store.decoration.autoRegisterLabels = action.payload.enable;
    } else if (action.type === 'ENABLE_LABEL_STYLES') {
        store.labels[action.payload.id].enableStyle = action.payload.enable;
    } else if (action.type === 'SET_LABEL_UNDERLINE') {
        store.labels[action.payload.id].style.underline =
            action.payload.underline;
    } else if (action.type === 'SET_LABEL_BOLD') {
        store.labels[action.payload.id].style.bold = action.payload.bold;
    } else if (action.type === 'SET_LABEL_FONT_SIZE') {
        store.labels[action.payload.id].style.fontSize = isNaN(
            +action.payload.fontSize,
        )
            ? undefined
            : +action.payload.fontSize;
    } else if (action.type === 'SET_LABEL_ITALIC') {
        store.labels[action.payload.id].style.italic = action.payload.italic;
    } else if (action.type === 'TOGGLE_LABEL_CASE') {
        const label = store.labels[action.payload.id];
        const currentCase = label.style.case || 'unset';

        if (currentCase === 'unset') {
            label.style.case = 'upper';
        } else if (currentCase === 'upper') {
            label.style.case = 'title';
        } else if (currentCase === 'title') {
            label.style.case = 'lower';
        } else if (currentCase === 'lower') {
            label.style.case = 'unset';
        } else {
            label.style.case = 'unset';
        }
    } else if (action.type === 'SET_TTS_PITCH') {
        store.tts.pitch = action.payload.pitch;
    } else if (action.type === 'SET_TTS_RATE') {
        store.tts.rate = action.payload.rate;
    } else if (action.type === 'SET_TTS_VOLUME') {
        store.tts.volume = action.payload.volume;
    } else if (action.type === 'SET_TTS_VOICE') {
        store.tts.voice = action.payload.voice;
    } else if (action.type === 'SET_NOTES_FOLDER')
        store.notes.defaultFolder = action.payload.folder;
    else if (action.type === 'SET_NOTES_FOLDER_MODE')
        store.notes.defaultFolderMode = action.payload.mode;
    else if (action.type === 'SET_NOTES_NAMING_MODE')
        store.notes.notesNamingMode = action.payload.folder;
    else if (action.type === 'SET_NOTES_OPEN_AFTER_CREATION')
        store.notes.openNoteAfterCreation = action.payload.open;
    else if (action.type === 'SET_AUTO_SUGGEST_COMMENT_TYPE')
        store.editorSuggest.commentType = action.payload.type;
    else if (action.type === 'SET_NOTES_INSERT_LINK_TO_NOTE')
        store.notes.insertLinkToNote = action.payload.insert;
    else if (action.type === 'SET_NOTES_TEMPLATE')
        store.notes.template = action.payload.template;
    else if (action.type === 'ENABLE_DECORATE_COMMENT_TAGS')
        store.decoration.decorateCommentTags = action.payload.enable;
    return store;
};
