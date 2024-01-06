import { DateString } from '../settings/settings-type';

export const formattedDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0] as DateString;
};
