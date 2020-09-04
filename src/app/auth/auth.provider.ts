import { UserProvider } from './../data/user.provider';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, of } from 'rxjs';
import { User } from './../data/user';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthProvider {
    private readonly AUTH_STORAGE_KEY = 'authenticated';

    public user: BehaviorSubject<User>;
    private _user: User;

    constructor(
        private firebaseAuth: AngularFireAuth,
        private userProvider: UserProvider
    ) {
        this.user = new BehaviorSubject<User>(null);
        this.firebaseAuth.user.pipe(
            switchMap(firebaseUser => {
                if (firebaseUser) {
                    localStorage.setItem(this.AUTH_STORAGE_KEY, 'true');
                    return this.userProvider.get(firebaseUser.uid);
                } else {
                    localStorage.removeItem(this.AUTH_STORAGE_KEY);
                    return of(null);
                }
            })
        ).subscribe(user => {
            this._user = user;
            this.user.next(this._user);
        });
    }

    public async login(email: string, password: string) {
        return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
    }

    public async logout() {
        return this.firebaseAuth.auth.signOut();
    }

    public async registerUser(email: string, password: string, displayName?: string) {
        this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(cred => {
                const user: User = {
                    id: cred.user.uid,
                    email: cred.user.email,
                    displayName
                };
                return this.userProvider.set(user);
            });
    }

    public changePassword(password: string) {
        if (this._user) {
            return this.firebaseAuth.auth.currentUser.updatePassword(password);
        }
    }

    public resetPassword(email: string) {
       return this.firebaseAuth.auth.sendPasswordResetEmail(email);
    }

    public isAuthenticated() {
        const auth = localStorage.getItem(this.AUTH_STORAGE_KEY);
        if (auth) {
            return true;
        }
        return false;
    }
}
