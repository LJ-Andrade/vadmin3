import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionConfig } from '@src/app/interfaces/crud.interface';

@Component({
    selector: 'app-section-header',
    standalone: true,
    imports: [ CommonModule ],
    template: `
        <h1>
            <i [class]="sectionConfig.icon" style="color: slateblue"></i>
            <span class="section-title">{{ sectionConfig.namePlural | titlecase }}

            @if (sectionAction) {
                <span class="section-action small"> | {{ sectionAction }}</span>
            }

            </span>
        </h1>
    `
})

export class SectionHeader {
    @Input() sectionConfig!: SectionConfig
    @Input() sectionAction: string = ''
}
