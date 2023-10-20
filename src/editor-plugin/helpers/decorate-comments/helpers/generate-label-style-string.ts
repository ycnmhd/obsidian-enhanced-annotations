import { LabelStyle } from '../../../../settings/settings-type';

export const generateLabelStyleString = (style: LabelStyle): string => {
    const styleStringParts: string[] = [];

    if (style.color) {
        styleStringParts.push(`color: ${style.color}`);
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
