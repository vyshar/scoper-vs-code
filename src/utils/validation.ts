export const validateScopeName = (value: string): string | null =>
    value.trim().length === 0 ? "Scope name cannot be empty" : null;
