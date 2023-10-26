import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

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
}
