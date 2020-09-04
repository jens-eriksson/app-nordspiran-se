import { StockPrices } from './stock-prices';
import { WhereCondition } from './where-condition';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class StockPricesProvider {
  private COLLECTION = 'stock-prices';

  constructor(private db: AngularFirestore) {}

  public all(orderBy, direction): Observable<StockPrices[]> {
    return this.db
      .collection<StockPrices>(this.COLLECTION, ref =>
        ref.orderBy(orderBy, direction)
      )
      .valueChanges({idField: 'id'});
  }

  public get(id: string): Observable<StockPrices> {
    return this.db
      .collection(this.COLLECTION)
      .doc<StockPrices>(id)
      .valueChanges().pipe(
        tap(s => s.id = id)
      );
  }

  public query(
    conditions: WhereCondition[],
    orderBy,
    direction
  ): Observable<StockPrices[]> {
    return this.db
      .collection<StockPrices>(this.COLLECTION, ref => {
        let query = ref.orderBy(orderBy, direction);
        for (const c of conditions) {
          query = query.where(c.field, c.op, c.value);
        }
        return query;
      })
      .valueChanges();
  }

  public async set(stockPrices: StockPrices) {
    return this.db
      .collection(this.COLLECTION)
      .doc<StockPrices>(stockPrices.id)
      .set(stockPrices);
  }

  public async delete(id: string) {
    return this.db
      .collection(this.COLLECTION)
      .doc<StockPrices>(id)
      .delete();
  }
}
