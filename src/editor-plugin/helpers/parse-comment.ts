export const parseComment = (comment: string) => {
    const startRegex = /^\s*<!(-{2})/.exec(comment);
    const endRegex = startRegex && /(-{2})>\s*$/.exec(comment);
    if (startRegex && endRegex) {
        const start = startRegex[0];
        const end = endRegex[0];
        const inside = comment.replace(start, '').replace(end, '');
        const labelRegex = /^([^:\s]+): ?(.+)$/g.exec(inside);
        const text = labelRegex ? labelRegex[2] : inside;
        const label = labelRegex ? labelRegex[1] : '';
        return [start, label || '/', text, end];
    }
};
