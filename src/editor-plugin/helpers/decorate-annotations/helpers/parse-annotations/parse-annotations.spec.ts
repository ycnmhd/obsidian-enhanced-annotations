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

    it('should handle text in between highlights', () => {
        const text = `C: ==Convallis aenean et tortor at risus viverra adipiscing. 
At augue eget arcu dictum. Sit amet mattis vulputate== 
Quam nulla porttitor massa id neque aliquam
==Viverra accumsan in nisl nisi scelerisque eu ultrices vitae auctorg==. `;
        const annotations = parseAnnotations(text);
        expect(annotations.map((v) => v.text)).toEqual([
            'Convallis aenean et tortor at risus viverra adipiscing. At augue eget arcu dictum. Sit amet mattis vulputate',
            'Viverra accumsan in nisl nisi scelerisque eu ultrices vitae auctorg',
        ]);
    });

    it('should handle closing tag next line', () => {
        const text = `==rhoncus urna neque viverra. Tempus
== malesuada fames. Cursus euismod quis viverra nibh cras pulvinar mattis nunc sed. Mauris sit amet massa vitae tortor condimentum.`;
        const annotations = parseAnnotations(text);
        expect(annotations.map((v) => v.text)).toEqual([
            'rhoncus urna neque viverra. Tempus',
        ]);
    });

    it('should skip blocks', () => {
        const input = [
            '1 2',
            '3 4',
            '```',
            'x==1',
            '```',
            '==5 6',
            '7 8',
            '9 10==',
            '11 12',
        ].join('\n');
        const output = '5 6 7 8 9 10';
        const annotations = parseAnnotations(input);
        expect(annotations.map((v) => v.text).join('')).toEqual(output);
    });

    it('should skip blocks that have a space before backticks', () => {
        const input = [
            '1 2',
            '3 4',
            ' ```java',
            'x==1',
            '```',
            '==5 6',
            '7 8',
            '9 10==',
            '11 12',
        ].join('\n');
        const output = '5 6 7 8 9 10';
        const annotations = parseAnnotations(input);
        expect(annotations.map((v) => v.text).join('')).toEqual(output);
    });

    it('should skip inline code blocks', () => {
        const input = '==highlighted text 1== `x == y` ==highlighted text 2==';
        const annotations = parseAnnotations(input);
        const output = 'highlighted text 1, highlighted text 2';
        expect(annotations.map((v) => v.text).join(', ')).toEqual(output);
    });

    it('should handle inline footnotes as comments', () => {
        const input =
            'That satchel was of great importance to them, it ==contained documents==^[the building schematics] on the ==case at hand\n' +
            'they were assigned to==^[it was the management\'s decision].';
        const annotations = parseAnnotations(input);
        expect(annotations[0].text).toEqual('contained documents');
        expect(annotations[0].inlineFootnote).toEqual('the building schematics');
        expect(annotations[1].text).toEqual('case at hand they were assigned to');
        expect(annotations[1].inlineFootnote).toEqual('it was the management\'s decision');
    });
});
