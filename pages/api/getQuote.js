import { db } from "@component/lib/firebase-config";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405);
        }

        const { id } = req.query;
        if (!id) return res.status(400);

        const snap = await getDoc(doc(db, "quotes", id));
        const quote = snap.data();

        const userSnap = await getDoc(doc(db, "users", quote._user.uid));
        const user = userSnap.data();
        const { displayName, profilePhoto, uid } = user;

        res.status(200).json({
            ...quote,
            _user: { displayName, profilePhoto, uid },
            created_on: quote.created_on.toDate(),
        });
    } catch (error) {
        console.error(error["error"] ? error["error"] : error);
        return res.status(error["status"] ? error["status"] : 500);
    }
}
