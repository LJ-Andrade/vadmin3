import { Component } from '@angular/core'
import { BadgeModule } from 'primeng/badge'
import { Card } from 'primeng/card'


@Component({
	selector: 'app-examples',
	standalone: true,
	imports: [ Card, BadgeModule ],
	templateUrl: './examples.component.html'
})

export class ExamplesComponent {
}
