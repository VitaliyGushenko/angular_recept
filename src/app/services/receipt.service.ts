import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  constructor(
    private readonly _firestore: Firestore,
    private readonly _auth: AuthService
  ) {}

  async addReceipt(data: any) {
    const collectionInstance = collection(this._firestore, 'recepts');
    const res = await addDoc(collectionInstance, data);
  }

  async getDocs() {
    const b: any[] = [];
    const q = query(collection(this._firestore, 'recepts'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((e) => {
      b.push({ ...e.data(), uid: e.id });
    });

    return b;
  }

  async remove(uid: string) {
    await deleteDoc(doc(this._firestore, 'recepts', uid));
  }

  async edit(receipt: any, uid: string) {
    const ref = doc(this._firestore, 'recepts', uid);

    await updateDoc(ref, {
      name: receipt.name,
      description: receipt.description,
    });
  }
}
