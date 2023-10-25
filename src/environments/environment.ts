import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const environment = {
  firebase: {
    apiKey: 'AIzaSyDUmw1iCEWyWkGRxxdKvsz4TD3BPUYmi1E',
    authDomain: 'recept-10ea1.firebaseapp.com',
    projectId: 'recept-10ea1',
    storageBucket: 'recept-10ea1.appspot.com',
    messagingSenderId: '338085119421',
    appId: '1:338085119421:web:73d228d4f396c003c6bed4',
  },

  production: false,
};

export const app = initializeApp(environment.firebase);
export const auth = getAuth(app);
