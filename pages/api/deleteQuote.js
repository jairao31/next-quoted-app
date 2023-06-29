import { db } from "@component/lib/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";

export default async function handler(req, res) {
    try {
        if (req.method !== "DELETE") {
            return res.status(405);
        }

        const { id } = req.query;
        if (!id) return res.status(400);

        await deleteDoc(doc(db, "quotes", id));

        res.status(200).json({ message: "quote deleted successfully" });
    } catch (error) {
        console.error(error["error"] ? error["error"] : error);
        return res.status(error["status"] ? error["status"] : 500);
    }
}
