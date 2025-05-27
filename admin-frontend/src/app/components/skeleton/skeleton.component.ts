import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-skeleton',
    templateUrl: './skeleton.component.html',
    standalone: true,
    imports: [CommonModule, SkeletonModule]
})

export class SkeletonComponent {
    @Input() rowsAmount: number = 4;
}