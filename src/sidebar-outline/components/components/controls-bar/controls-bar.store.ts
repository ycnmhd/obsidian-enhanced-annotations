import { writable } from 'svelte/store';
import { Store } from '../../../../helpers/store';

export const POSSIBLE_FONT_SIZES = [10, 12, 14, 16, 18, 20, 22, 24] as const;
export type FontSize = (typeof POSSIBLE_FONT_SIZES)[number];
export const fontSize = writable<FontSize>(12);

export const isReading = writable<boolean>(false);

export const pluginIdle = writable(false);

type Controls = {
    showSearchInput: boolean;
    showLabelsFilter: boolean;
    showExtraButtons: boolean;
    showStylesSettings: boolean;
    showOutlineSettings: boolean;
};

type ControlsAction =
    | { type: 'TOGGLE_EXTRA_BUTTONS' }
    | { type: 'TOGGLE_OUTLINE_SETTINGS' }
    | { type: 'TOGGLE_STYLES_SETTINGS' }
    | { type: 'TOGGLE_SEARCH_INPUT' }
    | { type: 'TOGGLE_LABELS_FILTERS' };

const updateState = (store: Controls, action: ControlsAction) => {
    if (action.type === 'TOGGLE_SEARCH_INPUT') {
        store.showSearchInput = !store.showSearchInput;
        if (store.showSearchInput) store.showStylesSettings = false;
    } else if (action.type === 'TOGGLE_LABELS_FILTERS') {
        store.showLabelsFilter = !store.showLabelsFilter;
        if (store.showLabelsFilter) store.showStylesSettings = false;
    } else if (action.type === 'TOGGLE_EXTRA_BUTTONS') {
        store.showExtraButtons = !store.showExtraButtons;
        if (!store.showExtraButtons) store.showStylesSettings = false;
    } else if (action.type === 'TOGGLE_STYLES_SETTINGS') {
        store.showStylesSettings = !store.showStylesSettings;
        if (store.showStylesSettings) {
            store.showSearchInput = false;
            store.showLabelsFilter = false;
            store.showOutlineSettings = false;
        }
    } else if (action.type === 'TOGGLE_OUTLINE_SETTINGS') {
        store.showOutlineSettings = !store.showOutlineSettings;
        if (store.showOutlineSettings) store.showStylesSettings = false;
    }
};
export const reducer = (store: Controls, action: ControlsAction): Controls => {
    updateState(store, action);
    return store;
};

export const controls = new Store<Controls, ControlsAction>(
    {
        showLabelsFilter: false,
        showSearchInput: false,
        showExtraButtons: false,
        showStylesSettings: false,
        showOutlineSettings: false,
    },
    reducer,
);
