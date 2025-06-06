import { Component, OnInit, ViewChild, inject, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RoutesRecognized } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '@src/app/services/layout.service';
import { PopoverModule } from 'primeng/popover';
import { Popover } from 'primeng/popover';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [ 
        CommonModule, RouterModule, Menubar, BadgeModule, 
        AvatarModule, InputTextModule, Ripple, ButtonModule,
        PopoverModule, ConfirmPopupModule, ToastModule, DialogModule
    ]
})

export class HeaderComponent implements OnInit {
    items: MenuItem[] = [];
    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    router = inject(Router);

    @ViewChild('op') op!: Popover;
    
    isLoggedIn = computed(() => this.authService.isAuthenticated());
    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);
    
    userData = computed(() => this.authService.getUserData());
    
    displayConfirmation: boolean = false;

    ngOnInit() {
        this.generateMenu();
        
        // Subscribe to router events to regenerate menu when routes change
        this.router.events.subscribe(event => {
            if (event instanceof RoutesRecognized) {
                this.generateMenu();
            }
        });

    }

    generateMenu() {
        const routes = this.router.config.find(route => route.path === '')?.children || [];
        this.items = this.buildMenu(routes, '');
    }

    buildMenu(routes: any[], parentPath: string): MenuItem[] {
        return routes
            .filter(route => route.data?.title || route.data?.icon)
            .filter(route => !route.data?.skipFromMenu)
            .map(route => {
                let currentPath: string;
                let pathForChildren = parentPath;
                
                // Calculate the current path regardless of whether it will be used for routing
                currentPath = parentPath ? `${parentPath}/${route.path}` : route.path;
                pathForChildren = currentPath; // Save the path for children

                // Determine if this item should have a routerLink
                const shouldHaveLink = !(route.data?.noRedirect || route.children?.length > 0);

                const menuItem: MenuItem = {
                    label: route.data?.title,
                    icon: route.data?.icon || '',
                    routerLink: shouldHaveLink ? currentPath : undefined
                };
                
                if (route.children) {
                    menuItem.items = this.buildMenu(route.children, pathForChildren);
                }
                
                return menuItem;
            });
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    toggle(event: any) {
        this.op.toggle(event);
    }

    goToProfile() {
        this.router.navigate(['/profile']);
    }

    async requestLogout() {
        this.closeLogoutConfirmation()
        await this.authService.logout();
    }

    openLogoutConfirmation() {
        this.displayConfirmation = true;
    }

    closeLogoutConfirmation() {
        this.displayConfirmation = false;
    }
}