import { db } from "@component/lib/firebase-config";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405);
        }

        const { uid } = req.query;

        let result = [];

        const snap = await getDoc(doc(db, "users", uid));
        const user = snap.data();

        const collectionRef = query(
            collection(db, "quotes"),
            where("_user.uid", "==", uid)
        );
        const quotesSnap = await getDocs(collectionRef);

        quotesSnap.docs.map((i) => {
            const data = i.data();
            const { displayName, uid, profilePhoto } = user;
            result.push({
                ...data,
                _user: { displayName, uid, profilePhoto },
                created_on: data.created_on.toDate(),
            });
        });

        result.sort((a, b) => {
            return new Date(b.created_on) - new Date(a.created_on);
        });

        res.status(200).json({ docs: result });
    } catch (error) {
        console.error(error["error"] ? error["error"] : error);
        return res.status(error["status"] ? error["status"] : 500);
    }
}
