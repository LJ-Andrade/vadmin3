import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'
import { providePrimeNG } from 'primeng/config'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { routes } from './app.routes'
import { AuthInterceptor } from './interceptors/auth.interceptor'
// import Aura from '@primeng/themes/aura'
// import Lara from '@primeng/themes/lara'
// import Nora from '@primeng/themes/nora'

import CustomTheme from '@src/theme/custom-theme' // This preset use Lara as base


export const appConfig: ApplicationConfig = {
  	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideAnimationsAsync(),
		provideHttpClient(withInterceptors([AuthInterceptor])),
		importProvidersFrom(ToastModule),
		MessageService,
		providePrimeNG({ theme: { preset: CustomTheme, options: { darkModeSelector: '.app-dark' } } }),
	]
};