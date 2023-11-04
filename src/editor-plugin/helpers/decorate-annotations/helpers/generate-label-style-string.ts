import { LabelStyle } from '../../../../settings/settings-type';

export const hexToRgb = (hex: string, opacity: number) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r},${g},${b},${opacity})`;
};

export const generateLabelStyleString = (
    style: LabelStyle,
    isHighlight: boolean,
): string => {
    const styleStringParts: string[] = [];

    if (style.color) {
        if (isHighlight) {
            const rgb = hexToRgb(style.color, (style.opacity || 80) / 100);
            styleStringParts.push(`background-color: ${rgb}`);
            styleStringParts.push(`color: white`);
        } else styleStringParts.push(`color: ${style.color}`);
    }

    if (style.italic) {
        styleStringParts.push('font-style: italic');
    }

    if (style.fontFamily) {
        styleStringParts.push('font-family: ' + style.fontFamily);
    }

    if (style.fontWeight) {
        styleStringParts.push(
            'font-weight: ' +
                (style.fontWeight === 'thin' ? 'lighter' : 'bolder'),
        );
    }

    if (style.opacity) {
        if (!isHighlight)
            styleStringParts.push('opacity: ' + style.opacity / 100);
    }

    if (style.underline) {
        styleStringParts.push('text-decoration: underline');
    }

    if (style.fontSize && !isNaN(style.fontSize)) {
        styleStringParts.push(`font-size: ${style.fontSize}px`);
    }

    if (style.case) {
        if (style.case === 'upper') {
            styleStringParts.push('text-transform: uppercase');
        } else if (style.case === 'lower') {
            styleStringParts.push('text-transform: lowercase');
        } else if (style.case === 'title') {
            styleStringParts.push('text-transform: capitalize');
        }
    }

    return styleStringParts.join('; ');
};
