import {
    Case,
    CommentFormat,
    DefaultFolderMode,
    DefaultPalette,
    FontFamily,
    FontWeight,
    NotesNamingMode,
    Opacity,
    Settings,
} from './settings-type';
import { getDefaultColor } from './helpers/get-default-color';
import { isValidLabel } from '../editor-suggest/helpers/is-valid-label';
import { formattedDate } from '../helpers/date-utils';
import { pluginIsIdle } from './settings-selectors';
import { ClipboardTemplateSection } from '../clipboard/helpers/annotations-to-text';

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
    | { type: 'SET_TAG_FONT_WEIGHT'; payload: { weight?: FontWeight } }
    | { type: 'SET_TAG_FONT_FAMILY'; payload: { family?: FontFamily } }
    | { type: 'SET_TAG_FONT_SIZE'; payload: { fontSize?: number } }
    | { type: 'SET_TAG_OPACITY'; payload: { opacity?: Opacity } }
    | { type: 'ENABLE_TAG_STYLES'; payload: { enable: boolean } }
    | {
          type: 'SET_LABEL_FONT_WEIGHT';
          payload: {
              id: string;
              weight?: FontWeight;
          };
      }
    | {
          type: 'SET_LABEL_FONT_FAMILY';
          payload: {
              id: string;
              family?: FontFamily;
          };
      }
    | {
          type: 'SET_LABEL_FONT_OPACITY';
          payload: {
              id: string;
              opacity?: Opacity;
          };
      }
    | {
          type: 'SET_LABEL_FONT_SIZE';
          payload: {
              id: string;
              fontSize?: number;
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
          type: 'SET_LABEL_CASE';
          payload: {
              id: string;
              case?: Case;
          };
      }
    | { type: 'SET_TTS_VOLUME'; payload: { volume: number } }
    | { type: 'SET_TTS_RATE'; payload: { rate: number } }
    | { type: 'SET_TTS_PITCH'; payload: { pitch: number } }
    | { type: 'SET_TTS_VOICE'; payload: { voice: string } }
    | { type: 'SET_TTS_FOCUS_COMMENT_IN_EDITOR'; payload: { enable: boolean } }
    | { type: 'SET_NOTES_FOLDER'; payload: { folder: string } }
    | { type: 'SET_NOTES_FOLDER_MODE'; payload: { mode: DefaultFolderMode } }
    | { type: 'SET_NOTES_TEMPLATE'; payload: { template: string } }
    | { type: 'SET_NOTES_NAMING_MODE'; payload: { folder: NotesNamingMode } }
    | { type: 'SET_NOTES_OPEN_AFTER_CREATION'; payload: { open: boolean } }
    | { type: 'SET_NOTES_INSERT_LINK_TO_NOTE'; payload: { insert: boolean } }
    | {
          type: 'SET_AUTO_SUGGEST_COMMENT_TYPE';
          payload: { type: CommentFormat };
      }
    | { type: 'LOG_PLUGIN_USED' }
    | { type: 'LOG_PLUGIN_STARTED' }
    | {
          type: 'SET_CLIPBOARD_TEMPLATE';
          payload: { template: string; name: ClipboardTemplateSection };
      }
    | {
          type: 'TOGGLE_TRUNCATE_FILE_NAME';
      }
    | { type: 'SET_DEFAULT_PALETTE'; payload: { palette: DefaultPalette } };

const updateState = (store: Settings, action: SettingsActions) => {
    const labels = store.decoration.styles.labels;
    const tag = store.decoration.styles.tag;
    if (action.type === 'SET_PATTERN') {
        if (isValidLabel(action.payload.pattern))
            labels[action.payload.id].label = action.payload.pattern;
    } else if (action.type === 'SET_COLOR') {
        labels[action.payload.id].style.color = action.payload.color;
    } else if (action.type === 'DELETE_GROUP') {
        delete labels[action.payload.id];
    } else if (action.type === 'NEW_GROUP') {
        if (!action.payload.pattern || isValidLabel(action.payload.pattern)) {
            const id = String(Date.now());
            labels[id] = {
                label: action.payload.pattern,
                id,
                enableStyle: true,
                style: {
                    color: getDefaultColor(store),
                    italic: true,
                    fontWeight: 'thin',
                },
            };
        }
    } else if (action.type === 'ENABLE_AUTO_SUGGEST') {
        store.editorSuggest.enableAutoSuggest = action.payload.enable;
    } else if (action.type === 'SET_AUTO_SUGGEST_TRIGGER') {
        if (action.payload.trigger)
            store.editorSuggest.triggerPhrase = action.payload.trigger;
    } else if (action.type === 'ENABLE_AUTO_REGISTER_LABELS')
        store.decoration.autoRegisterLabels = action.payload.enable;
    else if (action.type === 'ENABLE_LABEL_STYLES')
        labels[action.payload.id].enableStyle = action.payload.enable;
    else if (action.type === 'SET_LABEL_UNDERLINE')
        labels[action.payload.id].style.underline = action.payload.underline;
    else if (action.type === 'SET_LABEL_FONT_WEIGHT')
        labels[action.payload.id].style.fontWeight = action.payload.weight;
    else if (action.type === 'SET_LABEL_FONT_OPACITY')
        labels[action.payload.id].style.opacity = action.payload.opacity;
    else if (action.type === 'SET_LABEL_FONT_FAMILY')
        labels[action.payload.id].style.fontFamily = action.payload.family;
    else if (action.type === 'SET_LABEL_FONT_SIZE')
        labels[action.payload.id].style.fontSize = action.payload.fontSize;
    else if (action.type === 'SET_LABEL_ITALIC')
        labels[action.payload.id].style.italic = action.payload.italic;
    else if (action.type === 'SET_LABEL_CASE')
        labels[action.payload.id].style.case = action.payload.case;
    else if (action.type === 'SET_TTS_PITCH')
        store.tts.pitch = action.payload.pitch;
    else if (action.type === 'SET_TTS_RATE')
        store.tts.rate = action.payload.rate;
    else if (action.type === 'SET_TTS_VOLUME')
        store.tts.volume = action.payload.volume;
    else if (action.type === 'SET_TTS_VOICE')
        store.tts.voice = action.payload.voice;
    else if (action.type === 'SET_NOTES_FOLDER')
        store.notes.defaultFolder = action.payload.folder;
    else if (action.type === 'SET_NOTES_FOLDER_MODE')
        store.notes.defaultFolderMode = action.payload.mode;
    else if (action.type === 'SET_NOTES_NAMING_MODE')
        store.notes.notesNamingMode = action.payload.folder;
    else if (action.type === 'SET_NOTES_OPEN_AFTER_CREATION')
        store.notes.openNoteAfterCreation = action.payload.open;
    else if (action.type === 'SET_AUTO_SUGGEST_COMMENT_TYPE')
        store.editorSuggest.commentFormat = action.payload.type;
    else if (action.type === 'SET_NOTES_INSERT_LINK_TO_NOTE')
        store.notes.insertLinkToNote = action.payload.insert;
    else if (action.type === 'SET_NOTES_TEMPLATE')
        store.notes.template = action.payload.template;
    else if (action.type === 'ENABLE_TAG_STYLES')
        tag.enableStyle = action.payload.enable;
    else if (action.type === 'SET_TAG_FONT_FAMILY')
        tag.style.fontFamily = action.payload.family;
    else if (action.type === 'SET_TAG_FONT_SIZE')
        tag.style.fontSize = action.payload.fontSize;
    else if (action.type === 'SET_TAG_FONT_WEIGHT')
        tag.style.fontWeight = action.payload.weight;
    else if (action.type === 'SET_TAG_OPACITY')
        tag.style.opacity = action.payload.opacity;
    else if (action.type === 'SET_TTS_FOCUS_COMMENT_IN_EDITOR')
        store.tts.focusAnnotationInEditor = action.payload.enable;
    else if (action.type === 'LOG_PLUGIN_USED') {
        store.idling.daysUnused = [];
    } else if (action.type === 'LOG_PLUGIN_STARTED') {
        if (!pluginIsIdle(store)) {
            const date = formattedDate();
            const daysUnused = store.idling.daysUnused.sort();
            if (!daysUnused.includes(date)) {
                daysUnused.push(date);
                store.idling.daysUnused = daysUnused;
            }
        }
    } else if (action.type === 'SET_CLIPBOARD_TEMPLATE') {
        const { template, name } = action.payload;
        store.clipboard.templates[name] = template;
    } else if (action.type === 'TOGGLE_TRUNCATE_FILE_NAME') {
        store.notes.truncateFileName = !store.notes.truncateFileName;
    } else if (action.type === 'SET_DEFAULT_PALETTE') {
        store.decoration.defaultPalette = action.payload.palette;
    }
};
export const settingsReducer = (
    store: Settings,
    action: SettingsActions,
): Settings => {
    updateState(store, action);
    return store;
};
