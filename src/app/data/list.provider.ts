import { Subject, Observable } from 'rxjs';
import { AuthProvider } from './../auth/auth.provider';
import { List } from './../../../shared/list';
import { DataProvider } from './data.provider';
import { Injectable } from '@angular/core';

@Injectable()
export class ListProvider extends DataProvider<List> {

  constructor(private auth: AuthProvider) {
    super('lists');
  }

  public getByUser(): Observable<List[]> {
    return this.obseveCollection({conditions: [{ field: 'uid', op: '==', value: this.auth.uid()}]});
  }

  public set(list: List): Promise<List> {
    list.uid = this.auth.uid();
    return super.set(list);
  }
}
