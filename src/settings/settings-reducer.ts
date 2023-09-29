import { Settings } from './settings';

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
      };
export const settingsReducer = (
    store: Settings,
    action: SettingsActions,
): Settings => {
    store = JSON.parse(JSON.stringify(store));
    if (action.type === 'SET_PATTERN') {
        store.groups[action.payload.id].pattern = action.payload.pattern;
    } else if (action.type === 'SET_COLOR') {
        store.groups[action.payload.id].color = action.payload.color;
    } else if (action.type === 'DELETE_GROUP') {
        delete store.groups[action.payload.id];
    } else if (action.type === 'NEW_GROUP') {
        const id = String(Date.now());
        store.groups[id] = {
            pattern: '',
            color: '',
            id,
        };
    }
    return store;
};
