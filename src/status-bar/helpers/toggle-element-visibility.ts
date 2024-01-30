const className = 'enhanced-annotations__display-none';
export const toggleElementVisibility = (
    element: HTMLElement,
    visible: boolean,
) => {
    if (visible) {
        element.removeClass(className);
    } else {
        element.addClass(className);
    }
};
