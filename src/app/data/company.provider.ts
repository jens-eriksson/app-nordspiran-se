import { Company } from './company';
import { WhereCondition } from './where-condition';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class CompanyProvider {
  private COLLECTION = 'companies';

  constructor(private db: AngularFirestore) {}

  public all(orderBy, direction): Observable<Company[]> {
    return this.db
      .collection<Company>(this.COLLECTION, ref =>
        ref.orderBy(orderBy, direction)
      )
      .valueChanges({idField: 'id'});
  }

  public get(id: string): Observable<Company> {
    return this.db
      .collection(this.COLLECTION)
      .doc<Company>(id)
      .valueChanges().pipe(
        tap(c => {
          if (c) {
            c.id = id;
          }
        })
      );
  }

  public query(
    conditions: WhereCondition[],
    orderBy,
    direction
  ): Observable<Company[]> {
    return this.db
      .collection<Company>(this.COLLECTION, ref => {
        let query = ref.orderBy(orderBy, direction);
        for (const c of conditions) {
          query = query.where(c.field, c.op, c.value);
        }
        return query;
      })
      .valueChanges();
  }

  public async set(company: Company) {
    company.reports.sort((a, b) => {
      const periodA = a.period.toUpperCase();
      const periodB = b.period.toUpperCase();

      let comparison = 0;
      if (periodA > periodB) {
        comparison = -1;
      } else if (periodA < periodB) {
        comparison = 1;
      }
      return comparison;
    });

    return this.db
      .collection(this.COLLECTION)
      .doc<Company>(company.id)
      .set(company);
  }

  public async delete(id: string) {
    return this.db
      .collection(this.COLLECTION)
      .doc<Company>(id)
      .delete();
  }
}
