import { EditorRangeOrCaret } from 'obsidian';

export type ParsedComment = {
    text: string;
    label: string;
    range: EditorRangeOrCaret;
    position: {
        from: number;
        to: number;
    };
};
export const parseMultiLineComments = (
    lines: string[],
    lineNumber = 0,
    from = 0,
) => {
    const comments: ParsedComment[] = [];

    const state: {
        multiLinComment:
            | (Omit<ParsedComment, 'text'> & { text: string[] })
            | null;
        line: number;
        from: number;
    } = { multiLinComment: null, line: lineNumber, from };
    for (const line of lines) {
        let startRegex = /(<!--|%%)/.exec(line);
        let endRegex =
            startRegex || state.multiLinComment
                ? /(-->|%%)/.exec(line)
                : undefined;
        // single line comment
        if (startRegex && endRegex) {
            const start = startRegex[1];
            const end = endRegex[1];
            // todo: make sure comments are of the same type
            const from = line.indexOf(start);
            const beforeTo = line.lastIndexOf(end);
            const to = beforeTo + end.length;
            // start of multiline obsidian comment
            if (from === beforeTo) {
                if (state.multiLinComment) startRegex = null;
                else endRegex = null;
            } else {
                // single line comment
                const comment = line.replace(start, '').replace(end, '');
                const labelRegex = /^([^:\s]+): ?(.+)$/g.exec(comment);
                const text = (labelRegex ? labelRegex[2] : comment).trim();
                const label = (labelRegex ? labelRegex[1] : '').trim();
                if (text || label)
                    comments.push({
                        text: text,
                        label: label,
                        position: {
                            from: state.from + from,
                            to: state.from + to,
                        },
                        range: {
                            from: {
                                line: state.line,
                                ch: from,
                            },
                            to: {
                                line: state.line,
                                ch: to,
                            },
                        },
                    });
                state.multiLinComment = null;
            }
        }
        // start of multiline comment
        if (startRegex && !endRegex) {
            const start = startRegex[1];
            const comment = line.replace(start, '');

            const labelRegex = /^([^:\s]+): ?(.+)$/g.exec(comment);
            const text = labelRegex ? labelRegex[2] : comment;
            const label = (labelRegex ? labelRegex[1] : '').trim();

            const from = state.from + line.indexOf(start);

            if (text || label)
                state.multiLinComment = {
                    label,
                    text: [text],
                    position: {
                        from,
                        to: -1,
                    },
                    range: {
                        from: { line: state.line, ch: line.indexOf(start) },
                    },
                };
        }
        // end of multi line comment
        else if (endRegex && state.multiLinComment) {
            const end = endRegex[1];
            const to = line.lastIndexOf(end) + end.length;
            state.multiLinComment.text.push(
                line.substring(0, line.lastIndexOf(end)),
            );
            state.multiLinComment.position.to = state.from + to;
            state.multiLinComment.range.to = {
                line: state.line,
                ch: to,
            };
            const allText = state.multiLinComment.text
                .map((t) => t.trim())
                .filter(Boolean)
                .join(' ');
            if (allText)
                comments.push({
                    ...state.multiLinComment,
                    text: allText,
                });
            state.multiLinComment = null;
        }
        // middle of a multi line comment
        else if (state.multiLinComment) {
            state.multiLinComment.text.push(line);
        }
        state.line++;
        state.from += line.length + 1;
    }

    return comments;
};