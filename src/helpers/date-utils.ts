import { DateString } from '../settings/settings-type';

export const formattedDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0] as DateString;
};

export const formattedTime = () => {
    const date = new Date();
    const [hh, mm] = date.toISOString().split('T')[1].split(':');
    return `${hh}:${mm}`;
};

export const timeTag = () => {
    const [date, time] = new Date().toISOString().split('T');
    const [yyyy, mm_, dd] = date.split('-');
    const [hh, mm] = time.split(':');
    return `#${[yyyy.slice(2), mm_, dd, hh, mm].join('/')}`;
};
