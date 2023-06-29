import { db } from "@component/lib/firebase-config";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405);
        }

        const { uid } = req.query;
        if (!uid) return res.status(400);

        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) {
            const user = snap.data();
            res.status(200).json({
                exists: true,
                data: { ...user, created_on: user.created_on.toDate() },
            });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error(error["error"] ? error["error"] : error);
        return res.status(error["status"] ? error["status"] : 500);
    }
}
