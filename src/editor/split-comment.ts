export const splitComment = (comment: string) => {
    const emptyCommentRegex = /^<!(-{4,})>$/g.exec(comment);
    if (emptyCommentRegex) {
        const hyphens = emptyCommentRegex[1];
        const hyphensLength = hyphens.length;
        const isHyphensLengthEven = hyphensLength % 2 === 0;
        const adjustedHyphensLength = isHyphensLengthEven
            ? hyphensLength
            : hyphensLength - 1;
        const half = hyphens.substring(0, adjustedHyphensLength / 2);
        const start = '<!' + half;
        const end = half + '>';
        return [start, isHyphensLengthEven ? '' : '-', end];
    } else {
        const startRegex = /^<!(-{2,})/.exec(comment);
        const endRegex = /(-{2,})>$/.exec(comment);
        if (startRegex && endRegex) {
            const start = startRegex[0];
            const end = endRegex[0];
            const text = comment.replace(start, '').replace(end, '');
            return [start, text, end];
        }
    }
};
