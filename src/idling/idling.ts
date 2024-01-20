import LabeledAnnotations from '../main';
import {
    controls,
    pluginIdle,
} from '../sidebar-outline/components/components/controls-bar/controls-bar.store';
import { pluginIsIdle } from '../settings/settings-selectors';
import { fileAnnotations } from '../sidebar-outline/components/components/annotations-list/annotations-list.store';

/*
 * This plugin parses every line of the active document after each change made by the user.
 * The Idling class idles the plugin if it hasn't been used in the last 3 sessions.
 */
export class Idling {
    private enabled = false;
    private subscriptions: Set<() => void> = new Set();

    constructor(private plugin: LabeledAnnotations) {
        this.plugin.settings.dispatch({ type: 'LOG_PLUGIN_STARTED' });
        if (!pluginIsIdle(plugin.settings.getValue())) this.plugin.loadPlugin();
        this.subscribe();
    }

    enable() {
        this.logActivity();
    }

    private logActivity() {
        if (!this.enabled) {
            this.enabled = true;
            const wasIdle = pluginIsIdle(this.plugin.settings.getValue());
            this.plugin.settings.dispatch({ type: 'LOG_PLUGIN_USED' });
            if (wasIdle) {
                pluginIdle.set(false);
                this.plugin.loadPlugin();
            }
            for (const unsub of this.subscriptions) {
                unsub();
                this.subscriptions.delete(unsub);
            }
        }
    }

    private subscribe() {
        this.subscriptions.add(
            controls.subscribe((v, action) => {
                if (action) {
                    this.logActivity();
                }
            }),
        );
        this.subscriptions.add(
            fileAnnotations.subscribe((v) => {
                if (
                    Object.values(v.labels)
                        .flat()
                        .some((v) => v.label)
                ) {
                    this.logActivity();
                }
            }),
        );
    }
}
