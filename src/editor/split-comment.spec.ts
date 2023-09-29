import { describe, expect, it } from 'vitest';
import { splitComment } from './split-comment';

const data = [
    ['<!---->', ['<!--', '', '-->']],
    ['<!------>', ['<!---', '', '--->']],
    ['<!-------->', ['<!----', '', '---->']],
    ['<!------->', ['<!---', '-', '--->']],
    ['<!----hello--->', ['<!----', 'hello', '--->']], // todo: correct this case
];

describe('split-comment', () => {
    for (const sample of data) {
        it('test: ' + sample[0], () => {
            expect(splitComment(sample[0] as string)).toEqual(sample[1]);
        });
    }
});
