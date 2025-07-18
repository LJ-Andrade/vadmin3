import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// Lista de nombres válidos de eventos
export type GlobalEventName = 'logout' | 'refreshData' | 'customEvent' | 'resetMainForm';

// Estructura del evento global (con o sin payload)
export interface GlobalEvent {
  name: GlobalEventName;
  payload?: any;
}

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private eventSubject = new Subject<GlobalEvent>();

  // Emitir evento
  emit(name: GlobalEventName, payload?: any): void {
    this.eventSubject.next({ name, payload });
  }

  // Escuchar evento
  on<T = any>(name: GlobalEventName) {
    return this.eventSubject.asObservable().pipe(
      filter(event => event.name === name),
      map(event => event.payload as T)
    );
  }
}


// Example
// private subscription = new Subscription();

// ngOnInit() {
//   const sub1 = this.eventBus.on('logout').subscribe(() => {
//     console.log('Logout');
//   });

//   const sub2 = this.eventBus.on('refreshData').subscribe(data => {
//     console.log('Refresh', data);
//   });

//   this.subscription.add(sub1);
//   this.subscription.add(sub2);
// }

// ngOnDestroy() {
//   this.subscription.unsubscribe(); // Desuscribe todo junto
// }