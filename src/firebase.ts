import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAjQh0h42X7zP3iPhn6mFQcYN51SX1PV1Y',
  authDomain: 'study-planner-pro-b2fb1.firebaseapp.com',
  projectId: 'study-planner-pro-b2fb1',
  storageBucket: 'study-planner-pro-b2fb1.firebasestorage.app',
  messagingSenderId: '627611639960',
  appId: '1:627611639960:web:afb8465edd864e73e270ed',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)