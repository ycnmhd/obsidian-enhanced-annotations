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
    '#405d72',
    '#57534e',
    '#a8a29e',
    '#f87171',
    '#ea580c',
    '#eab308',
    '#ca8a04',
    '#65a30d',
    '#22c55e',
    '#0d9488',
    '#0891b2',
    '#6366f1',
    '#d946ef',
    '#db2777',
    '#f43f5e',
    '#0ea5e9',
].sort(() => (Math.random() > 0.5 ? 1 : 0));

export const getDefaultColor = (groups: LabelSettings[]) => {
    const colors = new Set(groups.map((g) => g.style.color).filter(Boolean));
    return defaultColors.find((c) => !colors.has(c));
};
