import { AuthProvider } from './../auth/auth.provider';
import { PageState } from './../../../shared/page-state';
import { DataProvider } from './data.provider';
import { Injectable } from '@angular/core';

@Injectable()
export class PageStateProvider extends DataProvider<PageState> {
  private states: PageState[] = [];

  constructor(private auth: AuthProvider) {
    super('page-states');
    this.load();
  }

  public async load() {
    this.states = await this.query({conditions: 
        [
          {
            field: 'uid', 
            op: '==', 
            value: this.auth.uid()
          }
        ]});
  }

  public getByPath(path: string): PageState {
    return this.states.find(s => s.path === path);
  }

  public async set(pageState: PageState): Promise<PageState> {
    if (this.auth.isAuthenticated) {
        pageState.uid = this.auth.uid();
        const state = await super.set(pageState);
        if (!this.getByPath(state.path)) {
            this.states.push(state);
        }
        return state;
    }

    return null;
  }
}

