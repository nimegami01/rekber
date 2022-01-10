import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService {
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  // Login
  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.signInWithPopup(provider).then((res) => {
        resolve(res);
      });
    });
  }

  async userUpdate(data: any) {
    try {
      const check = await this.userCheck({
        email: data.email,
      });
      if (check['empty']) {
        this.afs.firestore.collection('user').add({
          email: data.email,
          fullName: data.fullName,
          picture: data.picture
            ? data.picture
            : 'https://www.kaorinusantara.or.id/wp-content/uploads/2020/01/violet-evergarden.jpg',
          uid: data.uid,
          timestampCreate: firebase.firestore.FieldValue.serverTimestamp(),
          role: 1,
        });
      } else {
        this.afs.firestore.collection('user').doc(check.docs[0].id).update({
          email: data.email,
          fullName: data.fullName,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async login(email: string, password: string) {
    var result = await this.afAuth.signInWithEmailAndPassword(email, password);
    return result;
  }

  // Register
  async register(data: any) {
    var result = await this.afAuth.createUserWithEmailAndPassword(
      data.email,
      data.password
    );
    await this.sendEmailVerification();

    return result;
  }

  // Email Verification
  async sendEmailVerification() {
    return (await this.afAuth.currentUser)?.sendEmailVerification();
  }

  // User Check with Email
  async userCheck(data: any) {
    return await this.afs.firestore
      .collection('user')
      .where('email', '==', data.email)
      .get();
  }
}
