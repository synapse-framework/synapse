// Utility functions for UI components
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
export function createTheme(theme) {
    return {
        name: theme.name || 'custom',
        colors: {
            primary: theme.colors?.primary || '#3b82f6',
            secondary: theme.colors?.secondary || '#6b7280',
            background: theme.colors?.background || '#ffffff',
            text: theme.colors?.text || '#111827'
        }
    };
}
//# sourceMappingURL=index.js.map