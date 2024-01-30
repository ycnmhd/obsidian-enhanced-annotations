import { ExtraButtonComponent, Notice } from 'obsidian';

type Option<T extends string | number> = {
    name?: string;
    value: T;
    iconType: 'svg-html' | 'svg-name';
    iconContent: string;
};

type Props<T extends string | number> = {
    button: ExtraButtonComponent;
    options: Option<T>[];
    value?: T;
    onChange: (value?: T) => void;
    name: string;
};
export const MultiOptionExtraButton = <T extends string | number>({
    button,
    options,
    value,
    onChange,
    name,
}: Props<T>) => {
    const state = {
        selected: options.find((o) => o.value === value),
    };
    const defaultOption: Option<T> = {
        ...options[0],
        name: name,
    };
    const renderButton = () => {
        const option = state.selected || defaultOption;
        if (option.iconType === 'svg-html') {
            button.extraSettingsEl.empty();
            const parser = new DOMParser();
            const doc = parser.parseFromString(
                option.iconContent,
                'image/svg+xml',
            );
            button.extraSettingsEl.append(doc.documentElement);
        } else {
            button.setIcon(option.iconContent);
        }
        button.setTooltip(
            state.selected ? `${name}: ${option.name || option.value}` : name,
        );

        button.extraSettingsEl.setCssStyles({
            borderBottom: '1px solid var(--tab-outline-color)',
        });
        const svg = button.extraSettingsEl.firstElementChild as HTMLElement;
        if (svg) {
            if (state.selected) {
                svg.setCssStyles({
                    color: 'var(--color-accent)',
                    opacity: '100%',
                });
            } else {
                svg.setCssStyles({
                    color: 'var(--icon-color)',
                    opacity: '30%',
                });
            }
        }
    };

    renderButton();
    button.onClick(() => {
        let i = state.selected ? options.indexOf(state.selected) + 1 : 0;
        if (i >= options.length) i = -1;

        state.selected = options[i];
        renderButton();
        const value = state.selected ? state.selected.value : undefined;
        onChange(value);
        new Notice(`'${name}' set to '${value || 'default'}'`);
    });
};
