import { SIDEBAR_OUTLINE_VIEW_TYPE } from '../sidebar-outline/sidebar-outline-view';
import LabeledAnnotations from '../main';
import { fileAnnotations } from '../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { Annotation } from '../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { wordCount } from './word-count';
import { pluralize } from '../helpers/pluralize';

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
            await this.update(comments, highlights);
        });
    };

    private update = async (
        comments: Annotation[],
        highlights: Annotation[],
    ) => {
        const numberOfComments = comments.length;
        const numberOfHighlights = highlights.length;
        this.elements.comments.setText(
            `${pluralize(numberOfComments, 'comment', 'comments')}`,
        );
        if (numberOfComments) {
            const commentsText = comments.map((c) => c.text).join();
            const commentsChars = commentsText.length;
            const commentsWords = await wordCount(commentsText);
            this.elements.comments.ariaLabel = `${pluralize(
                commentsWords,
                'word',
                'words',
            )} ${pluralize(commentsChars, 'character', 'characters')}`;
        }
        if (numberOfHighlights) {
            this.elements.highlights.style.display = 'inline';
            const highlightsText = highlights.map((c) => c.text).join();
            const highlightsChars = highlightsText.length;
            const highlightsWords = await wordCount(highlightsText);
            this.elements.highlights.setText(
                `${pluralize(numberOfHighlights, 'highlight', 'highlights')}`,
            );
            this.elements.highlights.ariaLabel = `${pluralize(
                highlightsWords,
                'word',
                'words',
            )} ${pluralize(highlightsChars, 'character', 'characters')}`;
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
}
