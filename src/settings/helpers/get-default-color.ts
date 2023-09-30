import { Group } from '../settings-type';

const defaultColors = [
    { name: 'mutedBlue', hex: '#6A5ACD' },
    { name: 'mutedTeal', hex: '#008080' },
    { name: 'mutedGreen', hex: '#556B2F' },
    { name: 'mutedBrown', hex: '#8B4513' },
    { name: 'mutedBeige', hex: '#D2B48C' },
    { name: 'mutedLavender', hex: '#B0A7E6' },
    { name: 'mutedPurple', hex: '#800080' },
    { name: 'mutedRose', hex: '#FF6B6B' },
    { name: 'mutedOlive', hex: '#808000' },
    { name: 'mutedRed', hex: '#A52A2A' },
    { name: 'mutedSlate', hex: '#708090' },
    { name: 'mutedCrimson', hex: '#DC143C' },
    { name: 'mutedMustard', hex: '#FFDB58' },
    { name: 'mutedCyan', hex: '#008B8B' },
];

export const getDefaultColor = (groups: Group[]) => {
    const colors = new Set(groups.map((g) => g.color).filter(Boolean));
    return defaultColors.find((c) => !colors.has(c.hex));
};
