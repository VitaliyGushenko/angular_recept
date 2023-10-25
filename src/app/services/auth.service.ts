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

  constructor(public afAuth: AngularFireAuth) {
    // Добавляет наблюдателя за изменениями состояния входа пользователя
    onAuthStateChanged(auth, (user) => {
      this.user$.next(user ?? null);
      this.isLoading$.next(false);
      console.log('change: ', this.user$.value, this.isLoading$.value);
    });
  }

  doRegister(value: any) {
    console.log('Регистрация!!!');
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

  enter(value: any) {
    console.log('Вход!!!');
    this.isLoading$.next(true);
    return of(
      signInWithEmailAndPassword(auth, value.email, value.password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.initAuth();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
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
  }
}
