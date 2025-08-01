import { inject, Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class CrudCommon {

    private route = inject(ActivatedRoute);

    existingRecordId!: string;

    get sectionTypeName(): string {
        if(this.existingRecordId !== null) {
            return "Edición";
        } else {
            return "Creación";
        }
    }

    ngOnInit() {
        // Método 1: snapshot (solo lee una vez)
        this.existingRecordId = this.route.snapshot.paramMap.get('id')!;

        // Método 2: reactivo (por si cambia el parámetro sin recrear el componente)
        this.route.paramMap.subscribe(params => {
            this.existingRecordId = params.get('id')!;
        });

        // console.log(`🟢 CategoryCreateEdit - Record ID: ${this.existingRecordId}`);
    }

   

}
