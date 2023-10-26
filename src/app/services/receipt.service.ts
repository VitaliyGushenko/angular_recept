import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  constructor(private firestore: Firestore) {}

  async addReceipt(data: any) {
    console.log('save');
    try {
      const collectionInstance = collection(this.firestore, 'recepts');

      const res = await addDoc(collectionInstance, data)
        .then((e) => console.log('Добавлено: ', e))
        .catch((e) => console.log('Ошибка: ', e));
      console.log(res);
    } catch (e) {
      console.error(e);
    } finally {
    }
  }

  async getDocs() {
    console.log('get docs');
    const b: any[] = [];
    try {
      const q = query(collection(this.firestore, 'recepts'));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((e) => b.push(e.data()));
    } catch (e) {
      console.error(e);
    } finally {
    }
    return b;
  }
}
