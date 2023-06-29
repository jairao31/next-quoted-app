import { db } from "@component/lib/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
    try {
        if (req.method !== "PUT") {
            return res.status(405);
        }

        const { quoteId, quote, uid } = req.body;

        const snap = await getDoc(doc(db, "users", uid));
        const user = snap.data();
        const { displayName, profilePhoto } = user;
        const quoteRef = doc(db, `quotes`, quoteId);
        await updateDoc(quoteRef, { quote: quote });

        const updatedQuoteSnap = await getDoc(quoteRef);
        const updatedQuote = updatedQuoteSnap.data();

        res.status(200).json({
            ...updatedQuote,
            _user: { displayName, profilePhoto, uid },
            created_on: updatedQuote.created_on.toDate(),
        });
    } catch (error) {
        console.error(error["error"] ? error["error"] : error);
        return res.status(error["status"] ? error["status"] : 500);
    }
}
