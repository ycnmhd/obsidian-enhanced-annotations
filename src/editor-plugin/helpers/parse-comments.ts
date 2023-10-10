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
export const parseComments = (lines: string[], lineNumber = 0, from = 0) => {
    const comments: ParsedComment[] = [];

    const state: {
        multiLinComment: ParsedComment | null;
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
                const comment = line.replace(start, '').replace(end, '');
                const labelRegex = /^([^:\s]+): ?(.+)$/g.exec(comment);
                const text = labelRegex ? labelRegex[2] : comment;
                const label = labelRegex ? labelRegex[1] : '';
                if (text.trim())
                    comments.push({
                        text,
                        label,
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
            const label = labelRegex ? labelRegex[1] : '';

            const from = state.from + line.indexOf(start);

            state.multiLinComment = {
                label,
                text,
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
            const text = line.substring(0, line.lastIndexOf(end));
            if (text.trim()) state.multiLinComment.text += ' ' + text;
            state.multiLinComment.position.to = state.from + to;
            state.multiLinComment.range.to = {
                line: state.line,
                ch: to,
            };
            if (state.multiLinComment.text.trim())
                comments.push(state.multiLinComment);
            state.multiLinComment = null;
        }
        // middle of a multi line comment
        else if (state.multiLinComment) {
            if (line.trim()) state.multiLinComment.text += ' ' + line;
        }
        state.line++;
        state.from += line.length + 1;
    }

    return comments;
};
