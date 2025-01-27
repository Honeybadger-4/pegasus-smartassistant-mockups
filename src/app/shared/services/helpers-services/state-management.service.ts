import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateManagement {
  platformId = inject(PLATFORM_ID);
  private state = signal<any>({});

  constructor() {
    this.loadData();
  }

  setState(key: string, value: any) {
    this.state.update((currentState) => ({
      ...currentState,
      [key]: value,
    }));

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('stateManagement', JSON.stringify(this.state()));
    }
  }

  getState(key: string) {
    return this.state()[key];
  }

  loadData() {
    if (isPlatformBrowser(this.platformId)) {
      const state = JSON.parse(localStorage.getItem('stateManagement') || '{}');
      this.state.set(state);
    }
  }

  clearState() {
    this.state.set({});
  }
}
