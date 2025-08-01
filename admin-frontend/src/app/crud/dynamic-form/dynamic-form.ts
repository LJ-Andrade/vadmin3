import { Component, Input, inject, signal, computed } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { IftaLabelModule } from 'primeng/iftalabel'
import { InputTextModule } from 'primeng/inputtext'
import { FieldErrorComponent } from '@components/field-error/field-error.component'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { SelectModule } from 'primeng/select'
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table'
import { FormField, SectionConfig } from '@src/app/interfaces/crud.interface'
import { HelpersService } from '@src/app/services/herlpers.service'
import { ActionsBar } from '@src/app/components/actions-bar/actions-bar'
import { DataService } from '@src/app/services/data.service'

@Component({
    selector: 'app-dynamic-form',
    imports: [CommonModule, ButtonModule, ActionsBar, SelectModule, MultiSelectModule, FormsModule, ReactiveFormsModule,
        IftaLabelModule, FieldErrorComponent, InputTextModule, TableModule ],
        templateUrl: './dynamic-form.html',
    })

export class DynamicForm {
    dataService: DataService = inject(DataService);

    @Input() formFields!: FormField[];
    @Input() formSize: string = 'LARGE';
    @Input() sectionConfig!: SectionConfig;
    @Input() existingRecordId: string | null = null;
    @Input() showActionsBar: boolean = false;
    
    sectionForm: FormGroup = new FormGroup({});
    loading: boolean = false;
    saveBtnLabel: string = 'Guardar';
    ngOnInit() {
        this.buildSectionForm();
        this.loadRelations();
        if (this.existingRecordId) {
            this.fetchRecordAndFillForm();
        }
    }

    buildSectionForm() {
        this.sectionForm = new FormGroup({});
        this.formFields.forEach(field => {
            let defaultValue = field.value ?? null;
            if (field.type === 'images') defaultValue = [];
            this.sectionForm.addControl(field.name, new FormControl(defaultValue, field.validators));
        });
    }

    fetchRecordAndFillForm() {
        this.loading = true;
        this.dataService.httpFetch(`${this.sectionConfig.model}/${this.existingRecordId}`)
            .subscribe({
                next: (res: any) => {
                    // Si el backend devuelve el objeto plano, patchValue es suficiente
                    this.sectionForm.patchValue(res);
                    // Si tienes campos de tipo select múltiple, normaliza aquí si es necesario
                    this.formFields.forEach(field => {
                        if (field.type === 'select' && field.isArray && Array.isArray(res[field.name])) {
                            // Normaliza a number si los ids son number
                            let valueFieldName = 'id';
                            if (field.options && field.options.valueFieldName) {
                                valueFieldName = field.options.valueFieldName;
                            }
                            const ids = res[field.name].map((item: any) => typeof item === 'object' ? item[valueFieldName] : item);
                            this.sectionForm.get(field.name)?.setValue(ids);
                        }
                    });
                    this.loading = false;
                },
                error: () => { this.loading = false; }
            });
    }

    loadRelations() {
        this.formFields.forEach(field => {
            if (field.isRelation && field.options && field.options.name) {
                this.dataService.getModelData(field.options.name).subscribe(data => {
                    if (field.options) {
                        field.options.items = data;
                        // Robustecer labelFieldName y valueFieldName
                        if (Array.isArray(data) && data.length > 0) {
                            const firstItem = data[0];
                            // Si no está definido, buscar la primera propiedad string para label
                            if (!field.options.labelFieldName) {
                                const labelKey = Object.keys(firstItem).find(k => typeof firstItem[k] === 'string');
                                field.options.labelFieldName = labelKey || 'label';
                            }
                            // Si no está definido, buscar la primera propiedad id/clave para value
                            if (!field.options.valueFieldName) {
                                const valueKey = Object.keys(firstItem).find(k => k.toLowerCase().includes('id') || typeof firstItem[k] === 'number');
                                field.options.valueFieldName = valueKey || 'id';
                            }
                        }
                    }
                });
            }
        });
    }

    submitForm() {
        // Aquí puedes emitir el evento o llamar al servicio para crear/editar
        // Ejemplo: this.save.emit(this.sectionForm.value)
        console.log(this.sectionForm.value);
    }
}
