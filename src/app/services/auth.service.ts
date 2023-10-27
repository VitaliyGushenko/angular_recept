import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
  onAuthStateChanged,
  UserCredential,
} from 'firebase/auth';
import * as firebase from 'firebase/app/';
import { auth } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth!: Auth;

  /**
   * Объект пользователя
   */
  user$ = new BehaviorSubject<any>(null);

  /**
   * Флаг загрузки информации о пользователе
   */
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    public afAuth: AngularFireAuth,
    private readonly _firestore: Firestore
  ) {
    // Добавляет наблюдателя за изменениями состояния входа пользователя
    onAuthStateChanged(auth, async (user) => {
      // this.user$.next(user ?? null);

      user
        ? await this.getUserData(user?.uid as string)
        : this.user$.next(null);

      this.isLoading$.next(false);
    });
  }

  doRegister(value: any) {
    return new Promise<UserCredential>((resolve, reject) => {
      createUserWithEmailAndPassword(auth, value.email, value.password).then(
        (res) => {
          resolve(res);
          this.initAuth();
        },
        (err) => reject(err)
      );
    });
  }

  async addUserInCollection(data: any, uid: string) {
    await setDoc(doc(this._firestore, 'users', uid), {
      ...data,
    });
  }

  enter(value: any) {
    this.isLoading$.next(true);
    return of(
      signInWithEmailAndPassword(auth, value.email, value.password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          this.initAuth();
        })
        .finally(() => {
          this.isLoading$.next(false);
        })
    );
  }

  async logOut() {
    try {
      this.isLoading$.next(true);
      await signOut(this.auth);
    } catch (e) {
      console.log('Ошибка при выходе: ', e);
    } finally {
      this.isLoading$.next(false);
    }
  }

  initAuth() {
    this.auth = getAuth();
    if (this.auth) this.getUserData(this.auth.currentUser?.uid as string);
  }

  async getUserData(uid: string) {
    try {
      const docRef = doc(this._firestore, 'users', uid);
      const docSnap = await getDoc(docRef);
      this.user$.next({
        ...docSnap.data(),
        uid: uid ?? this.auth?.currentUser?.uid,
        email: this.auth?.currentUser?.email,
      });
    } catch (e) {
      console.error('Ошибка: ', e);
    } finally {
    }
  }
}
