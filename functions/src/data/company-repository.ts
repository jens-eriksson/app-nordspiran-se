import * as admin from 'firebase-admin';

export class CompanyRepository {
    private db: FirebaseFirestore.Firestore;

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert('../../../service-account.json'),
            databaseURL: "https://app-nordspiran-se.firebaseio.com"
        });
        this.db = admin.firestore();
    }

    async all(): Promise<FirebaseFirestore.DocumentData[]> {
        const snapshot = await this.db.collection('companies').get();
        const result: FirebaseFirestore.DocumentData[] = [];
        snapshot.forEach(doc => {
            result.push(doc.data());
        });
        return result;
    } 
}