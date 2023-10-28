const pluralRules = new Intl.PluralRules('en-US');

export const pluralize = (count: number, singular: string, plural: string) => {
    const grammaticalNumber = pluralRules.select(count);
    switch (grammaticalNumber) {
        case 'one':
            return count + ' ' + singular;
        case 'other':
            return count + ' ' + plural;
        default:
            throw new Error('Unknown: ' + grammaticalNumber);
    }
};
