import { Injectable, signal, computed, effect } from '@angular/core';

export interface layoutConfig {
    darkTheme: boolean; 
}

@Injectable({
    providedIn: 'root'
})

export class LayoutService {
    private _config: layoutConfig = {
        darkTheme: false,
    };

    
    layoutConfig = signal<layoutConfig>(this._config);

    theme = computed(() => (this.layoutConfig().darkTheme ? 'dark' : 'light'));

    constructor() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this._config.darkTheme = savedTheme === 'dark';
            this.layoutConfig.set(this._config);
        }
        
        effect(() => {
            const isDark = this.layoutConfig().darkTheme;
            this.applyTheme(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        this.applyTheme(this._config.darkTheme);
    }

    
    private applyTheme(isDark: boolean): void {
        if (isDark) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    toggleDarkMode(): void {
        this.layoutConfig.update(state => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    setDarkTheme(isDark: boolean): void {
        this.layoutConfig.update(state => ({
            ...state,
            darkTheme: isDark
        }));
    }
    
    isDarkTheme(): boolean {
        return this.layoutConfig().darkTheme;
    }
}