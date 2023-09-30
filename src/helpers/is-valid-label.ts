export const isValidLabel = (label: string) => {
    return /^\w+$/.test(label);
};
