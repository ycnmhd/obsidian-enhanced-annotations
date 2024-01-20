import { SIDEBAR_OUTLINE_VIEW_TYPE } from '../sidebar-outline/sidebar-outline-view';
import LabeledAnnotations from '../main';
import { fileAnnotations } from '../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { Annotation } from '../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { wordCount } from './word-count';
import { pluralize } from '../helpers/pluralize';
import { get } from 'svelte/store';

export class StatusBar {
    private elements: {
        comments: HTMLElement;
        highlights: HTMLElement;
        container: HTMLElement;
    };

    constructor(private plugin: LabeledAnnotations) {
        this.onLoad();
    }

    private onLoad = () => {
        const container = this.plugin.addStatusBarItem();
        this.elements = {
            container,
            comments: container.createEl('span'),
            highlights: container.createEl('span'),
        };
        this.elements.highlights.style.marginInlineStart = '5px';
        this.elements.container.addClass('mod-clickable');
        this.elements.container.onClickEvent(this.onClick);

        fileAnnotations.subscribe(async (v) => {
            const [comments, highlights] = Object.values(v.labels)
                .flat()
                .reduce(
                    (acc, v) => {
                        if (v.isHighlight) acc[1].push(v);
                        else acc[0].push(v);
                        return acc;
                    },
                    [[], []] as [Annotation[], Annotation[]],
                );
            await this.updateText(comments, highlights);
        });
        this.elements.container.onmouseenter = this.onHover;
    };

    private updateTooltip = async (
        comments: Annotation[],
        highlights: Annotation[],
    ) => {
        let fileTextChars = 0;
        const file = this.plugin.outline.getValue().view?.file;
        if (file) {
            const text = await this.plugin.app.vault.read(file);
            fileTextChars = text.length;
        }
        if (fileTextChars > 0) {
            const commentsBoilerplate = comments
                .map((v) => `==${`${v.label ? `${v.label}: ` : ''}`}==`)
                .join('').length;
            const highlightsBoilerplate = highlights
                .map((v) => `<!--${`${v.label ? `${v.label}: ` : ''}`}-->`)
                .join('').length;

            fileTextChars =
                fileTextChars - commentsBoilerplate - highlightsBoilerplate;
        }
        if (comments.length) {
            this.elements.comments.ariaLabel = await this.createTooltip(
                comments,
                fileTextChars,
            );
        }
        if (highlights.length) {
            this.elements.highlights.ariaLabel = await this.createTooltip(
                highlights,
                fileTextChars,
            );
        }
    };
    private async createTooltip(
        annotations: Annotation[],
        fileTextChars: number,
    ) {
        const commentsText = annotations.map((c) => c.text).join();
        const chars = commentsText.length;
        const words = await wordCount(commentsText);
        let tooltip = `${pluralize(words, 'word', 'words')} ${pluralize(
            chars,
            'character',
            'characters',
        )}`;
        if (fileTextChars > 0) {
            tooltip += ` (${Math.floor((chars / fileTextChars) * 100)}%)`;
        }
        return tooltip;
    }

    private updateText = async (
        comments: Annotation[],
        highlights: Annotation[],
    ) => {
        const numberOfComments = comments.length;
        const numberOfHighlights = highlights.length;
        if (numberOfComments) {
            this.elements.comments.style.display = 'inline';
            this.elements.comments.setText(
                `${pluralize(numberOfComments, 'comment', 'comments')}`,
            );
        } else {
            this.elements.comments.style.display = 'none';
        }
        if (numberOfHighlights) {
            this.elements.highlights.style.display = 'inline';
            this.elements.highlights.setText(
                `${pluralize(numberOfHighlights, 'highlight', 'highlights')}`,
            );
        } else {
            this.elements.highlights.style.display = 'none';
        }
    };

    private onClick = () => {
        const leaf = this.plugin.app.workspace.getLeavesOfType(
            SIDEBAR_OUTLINE_VIEW_TYPE,
        )[0];
        if (leaf) this.plugin.app.workspace.revealLeaf(leaf);
        else this.plugin.activateView();
    };

    private onHover = async () => {
        const v = get(fileAnnotations);

        const [comments, highlights] = Object.values(v.labels)
            .flat()
            .reduce(
                (acc, v) => {
                    if (v.isHighlight) acc[1].push(v);
                    else acc[0].push(v);
                    return acc;
                },
                [[], []] as [Annotation[], Annotation[]],
            );
        await this.updateTooltip(comments, highlights);
    };
}
