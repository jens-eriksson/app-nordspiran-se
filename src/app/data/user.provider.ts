import { User } from './user';
import { WhereCondition } from './where-condition';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class UserProvider {
  private COLLECTION = 'users';

  constructor(private db: AngularFirestore) {}

  public all(orderBy, direction): Observable<User[]> {
    return this.db
      .collection<User>(this.COLLECTION, ref =>
        ref.orderBy(orderBy, direction)
      )
      .valueChanges({idField: 'id'});
  }

  public get(id: string): Observable<User> {
    return this.db
      .collection(this.COLLECTION)
      .doc<User>(id)
      .valueChanges().pipe(
        tap(u => u.id = id)
      );
  }

  public query(
    conditions: WhereCondition[],
    orderBy,
    direction
  ): Observable<User[]> {
    return this.db
      .collection<User>(this.COLLECTION, ref => {
        let query = ref.orderBy(orderBy, direction);
        for (const c of conditions) {
          query = query.where(c.field, c.op, c.value);
        }
        return query;
      })
      .valueChanges();
  }

  public async set(user: User) {
    return this.db
      .collection(this.COLLECTION)
      .doc<User>(user.id)
      .set(user);
  }

  public async delete(id: string) {
    return this.db
      .collection(this.COLLECTION)
      .doc<User>(id)
      .delete();
  }
}
