import { LabelSettings } from '../settings-type';

const defaultColors = [
    '#658b8b',
    '#61447e',
    '#4f538c',
    '#6c6c4a',
    '#6b3f55',
    '#54837b',
    '#4b7c4b',
    '#7d3f3f',
    '#7f4d80',
    '#795c49',
    '#82687d',
    '#69577f',
    '#405d72',
];

export const getDefaultColor = (groups: LabelSettings[]) => {
    const colors = new Set(groups.map((g) => g.style.color).filter(Boolean));
    return defaultColors.find((c) => !colors.has(c));
};
