import * as firebase from 'firebase';
import { Subject, Observable } from 'rxjs';
import { Query } from './query';
import { Data } from './../../../shared/data';

export abstract class DataProvider<T extends Data> {
  private COLLECTION: string;
  private db: firebase.firestore.Firestore;

  constructor(collection: string) {
    this.COLLECTION = collection;
    this.db = firebase.firestore();
  }

  public async all(): Promise<T[]> {
    const data: any = await this.db.collection(this.COLLECTION).get();
    return data.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  public async query(
    query: Query
  ): Promise<T[]> {
    let ref: any = this.db.collection(this.COLLECTION);
    for (const condition of query.conditions) {
      ref = ref.where(condition.field, condition.op, condition.value);
    }
    if (query.orderBy) {
      ref = ref.orderBy(query.orderBy);
    }
    const data = await ref.get();
    return data.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  public async get(id: string): Promise<T> {
    if (!id) {
      return null;
    }
    const doc: any = await this.db.collection(this.COLLECTION).doc(id).get();
    if(!doc.exists) {
      return null;
    } 
    return {
      id,
      ...doc.data()
    };
  }

  public async set(data: T): Promise<T> {
    let ref: any;
    if (data.id) {
      ref = await this.db.collection(this.COLLECTION).doc(data.id);
      delete data.id;
      await ref.set(data);
    } else {
      delete data.id;
      ref = await this.db.collection(this.COLLECTION).add(data);
    }
    const doc = await ref.get();
    return {
      id: doc.id,
      ...doc.data()
    };
  }

  public async delete(id: string): Promise<void> {
    await this.db.collection(this.COLLECTION).doc(id).delete();
  }

  public observe(id: string): Observable<T> {
    if (!id) {
      return null;
    }
    const ref = this.db.collection(this.COLLECTION).doc(id);

    const subject = new Subject<T>();
    ref.onSnapshot(snapshot => {
      const data: any = {
        id: id,
        ...snapshot.data()
      };
      subject.next(data);
    });

    return subject;
  }

  public obseveCollection(query?: Query): Observable<T[]> {
    let ref: any = this.db.collection(this.COLLECTION);
    if (query) {
      for (const condition of query.conditions) {
        ref = ref.where(condition.field, condition.op, condition.value);
      }
      if (query.orderBy) {
        ref = ref.orderBy(query.orderBy);
      }
    }

    const subject = new Subject<T[]>();
    ref.onSnapshot(snapshot => {
      const data: T[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      subject.next(data);
    });

    return subject;
  }
}
