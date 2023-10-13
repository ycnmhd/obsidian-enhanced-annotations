export const noteVariables = ['content', 'label'] as const;

export const calculateFileContent = ({
    fileName,
    blockId,
    label,
    template,
}: {
    fileName: string;
    blockId: string;
    label: string;
    template: string;
}) => {
    const content = `![[${fileName}#${blockId}]]`;
    const variables: Record<(typeof noteVariables)[number], string> = {
        label,
        content,
    };
    for (const variable of noteVariables) {
        template = template.replace(`{{${variable}}}`, variables[variable]);
    }

    return template || content;
};
