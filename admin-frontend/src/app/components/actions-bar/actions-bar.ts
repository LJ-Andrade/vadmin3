import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToolbarModule } from "primeng/toolbar";

@Component({
	selector: 'app-actions-bar',
	imports: [ CommonModule, ToolbarModule ],
	template: `
            <p-toolbar styleClass="mb-1">
                <div class="p-toolbar-group-start">
                    <ng-content select="[slot=start]"></ng-content>
                </div>
                <div class="p-toolbar-group-end">
                    <ng-content select="[slot=end]"></ng-content>
                </div>
            </p-toolbar>

        `
})

export class ActionsBar {}