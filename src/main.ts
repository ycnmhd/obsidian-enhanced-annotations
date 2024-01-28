import { Menu, Plugin, TAbstractFile, TFile, TFolder } from 'obsidian';
import { addInsertCommentCommands } from './commands/commands';
import { Settings } from './settings/settings-type';
import {
    SIDEBAR_OUTLINE_VIEW_TYPE,
    SidebarOutlineView,
} from './sidebar-outline/sidebar-outline-view';
import { SettingsTab } from './settings/settings-tab/settings-tab';
import { Store } from './helpers/store';
import { SettingsActions, settingsReducer } from './settings/settings-reducer';
import { AnnotationSuggest } from './editor-suggest/annotation-suggest';
import { DEFAULT_SETTINGS } from './settings/default-settings';
import { tts } from './sidebar-outline/components/components/controls-bar/helpers/tts';
import { mergeDeep } from './settings/helpers/merge-objects';
import { registerEditorMenuEvent } from './note-creation/register-editor-menu-event';

import { OutlineUpdater } from './sidebar-outline/helpers/outline-updater/outline-updater';
import { loadOutlineStateFromSettings } from './settings/helpers/load-outline-state-from-settings';
import { subscribeSettingsToOutlineState } from './settings/helpers/subscribe-settings-to-outline-state';
import { StatusBar } from './status-bar/status-bar';
import { fileMenuItems } from './clipboard/file-menu-items';
import { subscribeDecorationStateToSettings } from './settings/helpers/subscribe-decoration-state-to-settings';
import { DecorationSettings } from './editor-plugin/helpers/decorate-annotations/decoration-settings';
import { EditorPlugin, editorPlugin } from './editor-plugin/editor-plugin';
import { Idling } from './idling/idling';

export default class LabeledAnnotations extends Plugin {
    outline: OutlineUpdater;
    settings: Store<Settings, SettingsActions>;
    statusBar: StatusBar;
    idling: Idling;
    decorationSettings: DecorationSettings;
    editorSuggest: AnnotationSuggest;
    private unsubscribeCallbacks: Set<() => void> = new Set();

    async onload() {
        await this.loadSettings();

        this.editorSuggest = new AnnotationSuggest(this.app, this);
        this.registerEditorSuggest(this.editorSuggest);
        this.registerEvent(
            this.app.workspace.on(
                'file-menu',
                (menu: Menu, abstractFiles: TAbstractFile) => {
                    if (
                        abstractFiles instanceof TFolder ||
                        (abstractFiles as TFile).extension === 'md'
                    )
                        fileMenuItems(this)(menu, abstractFiles);
                },
            ),
        );
        this.registerEvent(
            this.app.workspace.on('files-menu', fileMenuItems(this)),
        );

        addInsertCommentCommands(this);

        this.registerView(
            SIDEBAR_OUTLINE_VIEW_TYPE,
            (leaf) => new SidebarOutlineView(leaf, this),
        );

        this.idling = new Idling(this);
        this.app.workspace.onLayoutReady(async () => {
            await this.activateView();
            loadOutlineStateFromSettings(this);
            this.registerSubscription(...subscribeSettingsToOutlineState(this));
            this.addSettingTab(new SettingsTab(this.app, this));
            registerEditorMenuEvent(this);
        });
    }

    onunload() {
        tts.stop();
        for (const callback of this.unsubscribeCallbacks) {
            callback();
        }
    }

    loadPlugin() {
        this.decorationSettings = new DecorationSettings(this);
        EditorPlugin.plugin = this;
        this.outline = new OutlineUpdater(this);
        tts.setPlugin(this);
        this.unsubscribeCallbacks.add(subscribeDecorationStateToSettings(this));
        this.registerEditorExtension([editorPlugin]);
        this.statusBar = new StatusBar(this);
    }

    async loadSettings() {
        const settings = (await this.loadData()) || {};
        this.settings = new Store<Settings, SettingsActions>(
            mergeDeep(settings, DEFAULT_SETTINGS()),
            settingsReducer,
        );
        this.registerSubscription(
            this.settings.subscribe(() => {
                this.saveSettings();
            }),
        );
    }

    async saveSettings() {
        await this.saveData(this.settings.getValue());
    }

    async activateView() {
        this.app.workspace.detachLeavesOfType(SIDEBAR_OUTLINE_VIEW_TYPE);

        await this.app.workspace.getRightLeaf(false).setViewState({
            type: SIDEBAR_OUTLINE_VIEW_TYPE,
            active: true,
        });

        this.app.workspace.revealLeaf(
            this.app.workspace.getLeavesOfType(SIDEBAR_OUTLINE_VIEW_TYPE)[0],
        );
    }

    registerSubscription(...callback: (() => void)[]) {
        callback.forEach((callback) => {
            this.unsubscribeCallbacks.add(callback);
        });
    }
}
