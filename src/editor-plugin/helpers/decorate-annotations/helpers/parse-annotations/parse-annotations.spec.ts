import { parseAnnotations } from './parse-annotations';
import { describe, expect, it } from 'vitest';
import { sample1 } from './parse-annotation-samples';

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
    {
        input: [
            [
                `<!--n: first%%`,
                `<!--n: 
second==`,
                `<!--n: third==-->`,
                `==n: forth
                %%==`,
            ],
        ],
        output: [],
    },
];

describe('parse multi-line annotations', () => {
    for (const sample of samples) {
        it(`sample ${samples.indexOf(sample)}`, () => {
            const annotations = parseAnnotations(
                sample1(...sample.input),
                0,
                0,
            );
            const output = annotations.map((c) =>
                c.label ? c.label + ': ' + c.text : c.text,
            );
            expect(output).toEqual(sample.output);
        });
    }

    it('', () => {
        const annotations = parseAnnotations(
            '<!--n: some comment--> [[some link]]',
        );
        expect(annotations[0].text).toBe('some comment');
    });
});
