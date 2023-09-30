import { Settings } from './settings-type';
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
          type: 'ENABLE_LABEL_STYLES';
          payload: { id: string; enable: boolean };
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
        store.labels[action.payload.id].color = action.payload.color;
    } else if (action.type === 'DELETE_GROUP') {
        delete store.labels[action.payload.id];
    } else if (action.type === 'NEW_GROUP') {
        if (!action.payload.pattern || isValidLabel(action.payload.pattern)) {
            const id = String(Date.now());
            store.labels[id] = {
                label: action.payload.pattern,
                color: getDefaultColor(Object.values(store.labels))?.hex,
                id,
                enableStyles: true,
            };
        }
    } else if (action.type === 'ENABLE_AUTO_SUGGEST') {
        store.editorSuggest.enableAutoSuggest = action.payload.enable;
    } else if (action.type === 'SET_AUTO_SUGGEST_TRIGGER') {
        store.editorSuggest.triggerPhrase = action.payload.trigger;
    } else if (action.type === 'ENABLE_AUTO_REGISTER_LABELS') {
        store.parsing.autoRegisterLabels = action.payload.enable;
    } else if (action.type === 'ENABLE_LABEL_STYLES') {
        store.labels[action.payload.id].enableStyles = action.payload.enable;
    }
    return store;
};
