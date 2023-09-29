export const parseComment = (comment: string) => {
    const startRegex = /^<!(-{2})/.exec(comment);
    const endRegex = /(-{2})>$/.exec(comment);
    if (startRegex && endRegex) {
        const start = startRegex[0];
        const end = endRegex[0];
        const inside = comment.replace(start, '').replace(end, '');
        const groupRegex = /^(\w+): ?(.+)$/g.exec(inside);
        const text = groupRegex ? groupRegex[2] : inside;
        const group = groupRegex ? groupRegex[1] : '';
        return [start, group || '/', text, end];
    }
};
