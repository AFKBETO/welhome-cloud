import { Injectable } from '@angular/core';
import { ReservationService } from '../reservation/reservation.service';

const CONTEXTS = ['OWNER', 'RENTER'];

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  constructor(
    private reservationService: ReservationService,
  ) {
    const context = this.getContext();
    if (!context || !CONTEXTS.includes(context)) {
      this.setContext('RENTER');
    }
  }

  getContext(): string | null {
    return window.localStorage.getItem('context');
  }

  get isRenter(): boolean {
    return this.getContext() === 'RENTER';
  }

  changeContext() {
    if (this.getContext() === 'RENTER') {
      this.setContext('OWNER');
      this.reservationService.getOwnerReservations();
    } else {
      this.setContext('RENTER');
      this.reservationService.getReservations();
    }
  }

  setContext(context: 'OWNER' | 'RENTER') {
    window.localStorage.setItem('context', context);
  }
}
