import { AbstractInputSuggest, App, TFolder } from 'obsidian';

export class FolderSuggest extends AbstractInputSuggest<string> {
    content: Set<string>;

    constructor(
        app: App,
        private inputEl: HTMLInputElement,
        private onSelectCallback: (value: string) => void,
    ) {
        super(app, inputEl);
        this.content = this.loadContent();
    }

    loadContent(): Set<string> {
        const abstractFiles = this.app.vault.getAllLoadedFiles();
        const folders: Set<string> = new Set();

        for (const folder of abstractFiles) {
            if (folder instanceof TFolder) {
                folders.add(folder.path);
            }
        }

        return folders;
    }

    getSuggestions(inputStr: string): string[] {
        const lowerCaseInputStr = inputStr.toLocaleLowerCase();
        return [...this.content].filter((content) =>
            content.toLocaleLowerCase().contains(lowerCaseInputStr),
        );
    }
    renderSuggestion(content: string, el: HTMLElement): void {
        el.setText(content);
    }

    selectSuggestion(content: string): void {
        this.onSelectCallback(content);
        this.inputEl.value = content;
        this.inputEl.blur();
        this.close();
    }
}
