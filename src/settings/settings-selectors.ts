import { Settings } from './settings-type';

export const pluginIsIdle = (store: Settings) =>
    store.idling.daysUnused.length >= 3;
