import { describe, expect, it } from 'vitest';
import { parseComment } from './parse-comment';

const data = [
    ['<!---->', ['<!--', '', '', '-->']],
    ['<!------>', ['<!--', '', '--', '-->']],
    ['<!----hello--->', ['<!--', '', '--hello-', '-->']],
    ['<!--q: what is this?-->', ['<!--', 'q', 'what is this?', '-->']],
    ['<!--note:this is a note-->', ['<!--', 'note', 'this is a note', '-->']],
];

describe('parse-comment', () => {
    for (const sample of data) {
        it('test: ' + sample[0], () => {
            expect(parseComment(sample[0] as string)).toEqual(sample[1]);
        });
    }
});
