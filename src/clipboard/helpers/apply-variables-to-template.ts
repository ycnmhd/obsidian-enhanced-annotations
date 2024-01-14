export const applyVariablesToTemplate = ({
    template,
    variables,
}: {
    template: string;
    variables: Record<string, string>;
}) => {
    for (const [key, value] of Object.entries(variables)) {
        template = template.replace(`{{${String(key)}}}`, value);
    }

    return template;
};
