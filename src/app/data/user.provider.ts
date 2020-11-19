import { Injectable } from '@angular/core';
import { User } from './../../../shared/user';
import { DataProvider } from './data.provider';

@Injectable()
export class UserProvider extends DataProvider<User> {
  constructor() {
    super('users');
  }
}
