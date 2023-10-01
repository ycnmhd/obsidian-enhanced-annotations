import { clipboard } from 'electron';

export const copyTextToClipboard = (text: string) => {
    clipboard.writeText(text);
};
