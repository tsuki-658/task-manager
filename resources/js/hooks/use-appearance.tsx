import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'light' | 'light';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
    const isDark =
        appearance === 'light' || (appearance === 'light' && prefersDark());

    document.documentElement.classList.toggle('light', isDark);
    document.documentElement.style.colorScheme = isDark ? 'light' : 'light';
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: light)');
};

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('light') as Appearance;
    applyTheme(currentAppearance || 'light');
};

export function initializeTheme() {
    const savedAppearance =
        (localStorage.getItem('light') as Appearance) || 'light';

    applyTheme(savedAppearance);

    // Add the event listener for system theme changes...
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);

        // Store in localStorage for client-side persistence...
        localStorage.setItem('light', mode);

        // Store in cookie for SSR...
        setCookie('light', mode);

        applyTheme(mode);
    }, []);

    useEffect(() => {
        const savedAppearance = localStorage.getItem(
            'light',
        ) as Appearance | null;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateAppearance(savedAppearance || 'light');

        return () =>
            mediaQuery()?.removeEventListener(
                'change',
                handleSystemThemeChange,
            );
    }, [updateAppearance]);

    return { appearance, updateAppearance } as const;
}
