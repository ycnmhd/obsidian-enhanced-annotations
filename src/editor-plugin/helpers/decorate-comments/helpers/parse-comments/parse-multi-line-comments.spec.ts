import { parseMultiLineComments } from './parse-multi-line-comments';
import { describe, expect, it } from 'vitest';
import { sample1 } from './parse-comment-samples';

export type Sample = { input: Parameters<typeof sample1>; output: string[] };
const samples: Sample[] = [
    {
        input: [
            [
                `<!--n: first-->`,
                `<!--n: second-->`,
                `<!--n: third-->`,
                `<!--n: forth-->`,
            ],
        ],
        output: [`n: first`, `n: second`, `n: third`, `n: forth`],
    },
    {
        input: [
            [
                `<!--n: first-->`,
                `<!--n : second-->`,
                `%%n: third%%`,
                `<!-- forth-->`,
            ],
        ],
        output: [`n: first`, `n : second`, `n: third`, `forth`],
    },
    {
        input: [
            [
                `<!--n: 
first-->`,
                `<!--n : 

second-->`,
                `%%n: 

third%%`,
                `<!-- forth-->`,
            ],
        ],
        output: [`n: first`, `n : second`, `n: third`, `forth`],
    },
];

describe('parse multi-line comments', () => {
    for (const sample of samples) {
        it(`sample ${samples.indexOf(sample)}`, () => {
            const comments = parseMultiLineComments(
                sample1(...sample.input).split('\n'),
                0,
                0,
            );
            const output = comments.map((c) =>
                c.label ? c.label + ': ' + c.text : c.text,
            );
            expect(output).toEqual(sample.output);
        });
    }
});
