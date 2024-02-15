import { Settings } from '../settings-type';
import { getRandomElement } from '../../helpers/array-utils';

const palettes = {
    bright: [
        '#f65a5a',
        '#e99696',
        '#f37636',
        '#f6bc4a',
        '#f2df93',
        '#fcea26',
        '#bff341',
        '#93ef30',
        '#36e112',
        '#81fa8a',
        '#79de9e',
        '#00f384',
        '#00e4be',
        '#10cff1',
        '#0099ff',
        '#3da5f1',
        '#446df3',
        '#574ff6',
        '#9b5cf0',
        '#d777f6',
        '#fd35f6',
        '#f355b5',
        '#db2777',
    ],
    dull: [
        '#824b4b',
        '#875c3c',
        '#6b5449',
        '#774809',
        '#656535',
        '#54837b',
        '#658b8b',
        '#405d72',
        '#405d72',
        '#4f538c',
        '#69577f',
        '#61447e',
        '#7f4d80',
        '#82687d',
        '#6b3f55',
    ],
};

export const getDefaultColor = (settings: Settings) => {
    const groups = Object.values(settings.decoration.styles.labels);
    const palette = settings.decoration.defaultPalette || 'bright';
    const colors = new Set(groups.map((g) => g.style.color).filter(Boolean));
    return getRandomElement(palettes[palette].filter((c) => !colors.has(c)));
};
