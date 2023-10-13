// copied from https://github.com/RafaelGB/obsidian-db-folder/blob/075ba07b17c1fd5418241daa31d591a3d1a7166a/src/helpers/FileManagement.ts#L81
export function sanitizeFileName(path: string, replacement = '-') {
    const illegalCharacters = /[*"\\/<>:|?]/g;
    const unsafeCharactersForObsidianLinks = /[#^[]\|]/g;
    const dotAtTheStart = /^\./g;

    // credit: https://github.com/parshap/node-sanitize-filename/blob/209c39b914c8eb48ee27bcbde64b2c7822fdf3de/index.js#L33
    // eslint-disable-next-line no-control-regex
    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
    const reservedRe = /^\.+$/;
    const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
    const windowsTrailingRe = /[. ]+$/;

    let sanitized = path
        .replace(/"/g, "'")
        .replace(illegalCharacters, replacement)
        .replace(unsafeCharactersForObsidianLinks, replacement)
        .replace(dotAtTheStart, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement)
        .replace(windowsTrailingRe, replacement);

    if (replacement)
        sanitized = sanitized
            .replace(new RegExp(`${replacement}+`, 'g'), replacement)
            .replace(
                new RegExp(`^${replacement}(.)|(.)${replacement}$`, 'g'),
                '$1$2',
            );
    return sanitized;
}
