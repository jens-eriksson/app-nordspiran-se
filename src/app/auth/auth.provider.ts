import { UserProvider } from './../data/user.provider';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './../../../shared/user';
import * as firebase from 'firebase';

@Injectable()
export class AuthProvider {
    private readonly AUTH_STORAGE_KEY = 'uid';
    private auth: firebase.auth.Auth;
    private _user: User;
    public user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    constructor(
        private userProvider: UserProvider
    ) {
        this.auth = firebase.auth();
        if (this.isAuthenticated()) {
            this.userProvider.get(localStorage.getItem(this.AUTH_STORAGE_KEY))
                .then(user => {
                    this._user = user;
                    this.user.next(this._user);
                });
        }
        this.auth.onAuthStateChanged(firebaseUser => {
            this.userProvider.get(firebaseUser.uid)
                .then(user => {
                    if (firebaseUser) {
                        localStorage.setItem(this.AUTH_STORAGE_KEY, firebaseUser.uid);
                        this._user = user;
                        this.user.next(this._user);
                    } else {
                        localStorage.removeItem(this.AUTH_STORAGE_KEY);
                        this._user = null;
                        this.user.next(null);
                    }
                });
        });
    }

    public async login(email: string, password: string) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    public async logout() {
        return this.auth.signOut();
    }

    public async registerUser(email: string, password: string, displayName?: string) {
        this.auth.createUserWithEmailAndPassword(email, password)
            .then(cred => {
                const user: User = {
                    id: cred.user.uid,
                    email: cred.user.email,
                    displayName
                };
                this.userProvider.set(user);
            });
    }

    public changePassword(password: string) {
        if (this._user) {
            return this.auth.currentUser.updatePassword(password);
        }
    }

    public resetPassword(email: string) {
       return this.auth.sendPasswordResetEmail(email);
    }

    public uid() {
        return localStorage.getItem(this.AUTH_STORAGE_KEY);
    }

    public isAuthenticated() {
        const auth = localStorage.getItem(this.AUTH_STORAGE_KEY);
        if (auth) {
            return true;
        }
        return false;
    }
}
