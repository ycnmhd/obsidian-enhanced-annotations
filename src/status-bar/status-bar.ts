import { SIDEBAR_OUTLINE_VIEW_TYPE } from '../sidebar-outline/sidebar-outline-view';
import LabeledAnnotations from '../main';
import { fileAnnotations } from '../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { Annotation } from '../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { pluralize } from '../helpers/pluralize';
import { get } from 'svelte/store';
import { TFile } from 'obsidian';
import { createTooltip } from './helpers/create-tooltip';

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
            this.resetTooltip();
            await this.updateText(comments, highlights);
        });
        this.elements.container.onmouseenter = this.onHover;
    };

    private updateTooltip = async (
        comments: Annotation[],
        highlights: Annotation[],
    ) => {
        let file: TFile | null | undefined;
        let text = '';

        if (comments.length | highlights.length) {
            file = this.plugin.outline.getValue().view?.file;
            if (file) text = await this.plugin.app.vault.read(file);
        }
        if (comments.length) {
            this.elements.comments.ariaLabel = await createTooltip(
                comments,
                text,
            );
        }
        if (highlights.length) {
            this.elements.highlights.ariaLabel = await createTooltip(
                highlights,
                text,
            );
        }
    };

    private resetTooltip() {
        this.elements.comments.ariaLabel = '';
        this.elements.highlights.ariaLabel = '';
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

    private onClick = async () => {
        const leaf = this.plugin.app.workspace.getLeavesOfType(
            SIDEBAR_OUTLINE_VIEW_TYPE,
        )[0];
        if (leaf) this.plugin.app.workspace.revealLeaf(leaf);
        else await this.plugin.activateView();
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
