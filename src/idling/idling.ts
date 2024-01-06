import LabeledAnnotations from '../main';
import { pluginIdle } from '../sidebar-outline/components/components/controls-bar/controls-bar.store';
import { pluginIsIdle } from '../settings/settings-selectors';

/*
 * This plugin parses every line of the active document after each change made by the user.
 * The Idling class idles the plugin if it hasn't been used in the last 3 sessions.
 */
export class Idling {
    private enabled = false;

    constructor(private plugin: LabeledAnnotations) {
        if (!pluginIsIdle(plugin.settings.getValue())) this.plugin.loadPlugin();
        this.plugin.settings.dispatch({ type: 'LOG_PLUGIN_STARTED' });
    }

    logActivity() {
        if (!this.enabled) {
            this.enabled = true;
            const wasIdle = pluginIsIdle(this.plugin.settings.getValue());
            this.plugin.settings.dispatch({ type: 'LOG_PLUGIN_USED' });
            if (wasIdle) {
                pluginIdle.set(false);
                this.plugin.loadPlugin();
            }
        }
    }
}
