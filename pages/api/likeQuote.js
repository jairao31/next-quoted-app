import { db } from "@component/lib/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405);
        }

        const { uid, requestId } = req.body;

        const docRef = doc(db, `quotes`, requestId);
        const oldDoc = await getDoc(docRef);
        let likes = oldDoc.get("likes");

        if (likes[uid] === "") {
            delete likes[uid];
            await updateDoc(docRef, {
                likes: likes,
            });
        } else {
            await updateDoc(docRef, {
                [`likes.${uid}`]: "",
            });
        }

        const updatedDocSnap = await getDoc(docRef);

        const updatedDoc = updatedDocSnap.data();
        res.status(200).json(updatedDoc);
    } catch (error) {
        console.error(error["error"] ? error["error"] : error);
        return res.status(error["status"] ? error["status"] : 500);
    }
}
