import { Annotation, parseAnnotations } from './parse-annotations';
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

third!%%`,
                `<!-- forth-->`,
            ],
        ],
        output: [`n: first`, `n : second`, `n: third!`, `forth`],
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

    {
        input: [
            [
                `<!--n: first--> <!--n: first b-->`,
                `<!--n: second-->
<!--n: second b-->
`,
                `==n: third== text ==n: third b==`,
                `<!--n: 
first --> text <!--d: 
first b--> `,
            ],
        ],
        output: [
            `n: first`,
            'n: first b',
            `n: second`,
            'n: second b',
            `n: third`,
            `n: third b`,
            'n: first',
            'd: first b',
        ],
    },
];

const concatenate = (annotations: Annotation[]) =>
    annotations.map((c) => (c.label ? c.label + ': ' + c.text : c.text));

describe('parse multi-line annotations', () => {
    for (const sample of samples) {
        it(`sample ${samples.indexOf(sample)}`, () => {
            const annotations = parseAnnotations(
                sample1(...sample.input),
                0,
                0,
            );

            const output = concatenate(annotations);
            expect(output).toEqual(sample.output);
        });
    }

    it('should handle text after a comment', () => {
        const annotations = parseAnnotations(
            '<!--n: some comment--> [[some link]]',
        );
        expect(annotations[0].text).toBe('some comment');
    });
});
