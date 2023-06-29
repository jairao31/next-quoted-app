// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { db } from "@component/lib/firebase-config";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405);
        }

        const { body } = req;

        const user = {
            ...body,
            displayName: body.displayName || body.email.split("@")[0],
            profilePhoto: "",
            created_on: Timestamp.fromDate(new Date()),
        };

        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, user);

        res.status(200).json(user);
    } catch (error) {
        console.error(error["error"] ? error["error"] : error);
        return res.status(error["status"] ? error["status"] : 500);
    }
}
