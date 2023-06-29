import { db } from "@component/lib/firebase-config";
import {
    Timestamp,
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405);
        }

        const { body } = req;

        const collectionRef = collection(db, `quotes`);
        const docRef = await addDoc(collectionRef, {
            ...body,
            likes: {},
            created_on: Timestamp.fromDate(new Date()),
        });
        await updateDoc(doc(db, "quotes", docRef.id), { id: docRef.id });
        const usersRef = doc(db, "users", body._user.uid);
        await updateDoc(usersRef, { quotes: arrayUnion(docRef.id) });
        const updatedDocRef = await getDoc(doc(db, "quotes", docRef.id));
        const updatedDoc = updatedDocRef.data();
        res.status(200).json({
            ...updatedDoc,
            created_on: updatedDoc.created_on.toDate(),
        });
    } catch (error) {
        console.error(error["error"] ? error["error"] : error);
        return res.status(error["status"] ? error["status"] : 500);
    }
}
