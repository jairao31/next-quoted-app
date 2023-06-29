import { db } from "@component/lib/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405);
        }

        let result = [];

        const collectionRef = collection(db, "quotes");
        const quotesSnap = await getDocs(collectionRef);

        const users = [];
        quotesSnap.docs.map((i) => {
            const data = i.data();
            users.push(data._user.uid);
            result.push({ ...data, created_on: data.created_on.toDate() });
        });

        let userDoc = {};
        while (users.length) {
            let ids = users.splice(0, 10);
            const usersRef = query(
                collection(db, "users"),
                where("uid", "in", ids)
            );
            const usersSnap = await getDocs(usersRef);
            usersSnap.docs.map((i) => {
                const data = i.data();
                const { displayName, uid, profilePhoto } = data;
                userDoc[data.uid] = { displayName, uid, profilePhoto };
            });
        }

        result = result.map((i) =>
            userDoc[i._user.uid] ? { ...i, _user: userDoc[i._user.uid] } : i
        );

        result.sort((a, b) => {
            return new Date(b.created_on) - new Date(a.created_on);
        });

        res.status(200).json({ docs: result });
    } catch (error) {
        console.error(error["error"] ? error["error"] : error);
        return res.status(error["status"] ? error["status"] : 500);
    }
}
