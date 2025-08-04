import { Component, Input, inject, signal, computed } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Observable, forkJoin } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'

// ... (Importaciones existentes)
import { IftaLabelModule } from 'primeng/iftalabel'
import { InputTextModule } from 'primeng/inputtext'
import { FieldErrorComponent } from '@components/field-error/field-error.component'
import { ButtonModule } from 'primeng/button'
import { SelectModule } from 'primeng/select'
import { MultiSelectModule } from 'primeng/multiselect'
import { TableModule } from 'primeng/table'
import { FormField, SectionConfig } from '@src/app/interfaces/crud.interface'
import { HelpersService } from '@src/app/services/herlpers.service'
import { ActionsBar } from '@src/app/components/actions-bar/actions-bar'
import { DataService } from '@src/app/services/data.service'

@Component({
    selector: 'app-dynamic-form',
    standalone: true,
    imports: [CommonModule, ButtonModule, ActionsBar, SelectModule, MultiSelectModule, FormsModule, ReactiveFormsModule,
        IftaLabelModule, FieldErrorComponent, InputTextModule, TableModule],
    templateUrl: './dynamic-form.html',
})

export class DynamicForm {
    dataService: DataService = inject(DataService);

    @Input() formFields!: FormField[];
    @Input() formSize: string = 'LARGE';
    @Input() sectionConfig!: SectionConfig;
    @Input() existingRecordId: string | null = null;
    @Input() showActionsBar: boolean = false;

    // Estado centralizado con signals
    private readonly state = signal({
        loading: false,
        existingRecord: null as any,
        relations: {} as { [key: string]: any[] }
    });

    // Propiedades derivadas del estado
    loading = computed(() => this.state().loading);
    relations = computed(() => this.state().relations);

    sectionForm: FormGroup = new FormGroup({});
    saveBtnLabel: string = 'Guardar';

    ngOnInit() {
        this.buildSectionForm();
        this.loadFormData();
    }

    buildSectionForm() {
        this.formFields.forEach(field => {
            let defaultValue = field.value ?? null;
            if (field.type === 'images') defaultValue = [];
            this.sectionForm.addControl(field.name, new FormControl(defaultValue, field.validators));
        });
    }

    loadFormData() {
        this.state.update(s => ({ ...s, loading: true }));

        const record$ = this.existingRecordId
            ? this.dataService.httpFetch(`${this.sectionConfig.model}/${this.existingRecordId}`)
            : new Observable(observer => {
                observer.next(null);
                observer.complete();
            });

        const relationRequests = (this.sectionConfig.relations || [])
            .map(relation => {
                return this.dataService.getModelData(relation.model + '/all').pipe(
                    tap(data => this.updateFormFieldsWithOptions(relation.name, data))
                );
            });

        console.log(relationRequests);

        forkJoin([record$, ...relationRequests]).subscribe({
            next: ([record, ...relationsData]) => {
                if (record) {
                    this.state.update(s => ({ ...s, existingRecord: record }));
                    this.sectionForm.patchValue(record);
                    this.normalizeRelationsInForm(record);
                }

                // El resto de los datos ya se han procesado en el tap
                this.state.update(s => ({ ...s, loading: false }));
                console.log('Datos de relaciones cargados:', this.relations());
                console.log('Formulario inicializado:', this.sectionForm.value);
            },
            error: (err) => {
                console.error('Error al cargar los datos:', err);
                this.state.update(s => ({ ...s, loading: false }));
            }
        });
    }

    updateFormFieldsWithOptions(fieldName: string, data: any[]) {
        const field = this.formFields.find(f => f.name === fieldName);
        if (!field || !field.options) return;
        
        field.options.items = data;
        this.state.update(s => ({ ...s, relations: { ...s.relations, [fieldName]: data } }));
        
        // Lógica de autodescubrimiento de label y value
        if (Array.isArray(data) && data.length > 0) {
            const firstItem = data[0];
            if (!field.options.labelFieldName) {
                const labelCandidates = ['name', 'nombre', 'title', 'label', 'descripcion', 'description'];
                const labelKey = labelCandidates.find(k => k in firstItem && typeof firstItem[k] === 'string')
                    || Object.keys(firstItem).find(k => typeof firstItem[k] === 'string');
                field.options.labelFieldName = labelKey || 'label';
            }
            if (!field.options.valueFieldName) {
                const valueCandidates = ['id', 'uuid', 'key'];
                const valueKey = valueCandidates.find(k => k in firstItem)
                    || Object.keys(firstItem).find(k => typeof firstItem[k] === 'number' || typeof firstItem[k] === 'string');
                field.options.valueFieldName = valueKey || 'id';
            }
        }
    }
    
    normalizeRelationsInForm(record: any) {
        this.formFields.forEach(field => {
            if (field.type === 'select' && field.isArray && field.options) {
                const items = this.relations()[field.name];
                const valueFromRecord = record[field.name];

                if (!items || !valueFromRecord || valueFromRecord.length === 0) return;

                const valueFieldName = field.options.valueFieldName || 'id';
                const labelFieldName = field.options.labelFieldName || 'name';

                const firstValue = valueFromRecord[0];
                const firstItem = items[0];
                
                // Si el valor del backend es un objeto, extraer el id o el campo de valor
                if (typeof firstValue === 'object' && firstValue !== null) {
                    const normalizedValues = valueFromRecord.map((item: any) => item[valueFieldName] ?? item[labelFieldName]);
                    this.sectionForm.get(field.name)?.setValue(normalizedValues);
                } else if (typeof firstValue === 'string') {
                    // Si el valor es una string (y no un id), buscar el id en los items de la relación
                    const normalizedValues = valueFromRecord.map((value: string) => {
                        const foundItem = items.find((item: any) => item[labelFieldName] === value);
                        return foundItem ? foundItem[valueFieldName] : value;
                    });
                    this.sectionForm.get(field.name)?.setValue(normalizedValues);
                }
            }
        });
    }

    submitForm() {
        console.log(this.sectionForm.value);

        if (!this.validateForm()) {
            return;
        }

        const formData = new FormData();

        Object.entries(this.sectionForm.value).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach((v, i) => {
                        formData.append(`${key}[${i}]`, v.toString());
                    });
                } else if (
                    typeof value === 'string' ||
                    typeof value === 'number' ||
                    value instanceof Blob
                ) {
                    formData.append(key, value.toString());
                } else {
                    formData.append(key, JSON.stringify(value));
                }
            }
        });

        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}:`, value.name, '-', value.type, '-', value.size, 'bytes');
            } else {
                console.log(`${key}:`, value);
            }
        }
    }

    validateForm(): boolean {

        // Oculta todos los errores previos
        Object.values(this.sectionForm.controls).forEach(control => control.markAsUntouched());

        // Obtenemos los campos a ignorar si estamos actualizando un registro
        const ignoreFields = this.existingRecordId && this.sectionConfig.ignoreFieldsOnUpdate
            ? this.sectionConfig.ignoreFieldsOnUpdate
            : [];

        // Deshabilitamos temporalmente los campos que deben ser ignorados
        ignoreFields.forEach(fieldName => {
            const control = this.sectionForm.get(fieldName);
            if (control) {
                control.disable();
            }
        });

        const isFormValid = this.sectionForm.valid;

        // Volvemos a habilitar los campos. Es crucial hacer esto siempre,
        // sin importar si la validación pasó o falló.
        ignoreFields.forEach(fieldName => {
            const control = this.sectionForm.get(fieldName);
            if (control) {
                control.enable();
            }
        });

        if (!isFormValid) {
            this.sectionForm.markAllAsTouched();
            return false;
        }

        return true;
    }
}


