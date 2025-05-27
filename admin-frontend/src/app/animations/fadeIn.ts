import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';

const enterTransition = transition(':enter' , [
	style({
		opacity: 0
	}),
	animate('0.5s ease-in-out', style({ opacity: 1 }))
])

export const fadeIn = trigger('fadeIn', [ enterTransition ])
