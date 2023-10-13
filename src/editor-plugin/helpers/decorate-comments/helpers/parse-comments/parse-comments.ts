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
export const parseComments = (
    lines: string[],
    global_line = 0,
    global_from = 0,
) => {
    const comments: ParsedComment[] = [];

    for (const line of lines) {
        if (line.startsWith('<!--') || line.startsWith('%%')) {
            const endRegex = /(-->|%%)/.exec(line);

            // single line comment
            if (endRegex) {
                const startRegex = /(<!--|%%)/.exec(line) as RegExpExecArray;
                const start = startRegex[1];
                const end = endRegex[1];
                // todo: make sure comments are of the same type
                const from = line.indexOf(start);
                const beforeTo = line.lastIndexOf(end);
                const to = beforeTo + end.length;
                // start of multiline obsidian comment
                if (beforeTo > from) {
                    const comment = line.replace(start, '').replace(end, '');
                    const labelRegex = /^([^:\s]+): ?(.+)$/g.exec(comment);
                    const text = (labelRegex ? labelRegex[2] : comment).trim();
                    const label = (labelRegex ? labelRegex[1] : '').trim();
                    if (text || label)
                        comments.push({
                            text,
                            label,
                            position: {
                                from: global_from + from,
                                to: global_from + to,
                            },
                            range: {
                                from: {
                                    line: global_line,
                                    ch: from,
                                },
                                to: {
                                    line: global_line,
                                    ch: to,
                                },
                            },
                        });
                }
            }
        }

        global_line++;
        global_from += line.length + 1;
    }

    return comments;
};
