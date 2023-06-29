// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { db, storage } from "@component/lib/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405);
        }

        const form = formidable({ multiples: true, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                res.status(500).send("Something went wrong");
                return;
            }

            // console.log('fields:', fields);
            console.log("files:", files);
            let url = "";
            if (Object.keys(files).length > 0) {
                try {
                    const file = files.pic;
                    const storageRef = ref(
                        storage,
                        `/files/${file.newFilename}`
                    );
                    const buffer = fs.readFileSync(file.filepath);
                    uploadBytes(storageRef, buffer).then((snapshot) => {
                        getDownloadURL(snapshot.ref).then(async (URL) => {
                            const { uid } = fields;

                            const docRef = doc(db, `users`, uid);
                            await updateDoc(docRef, {
                                ...fields,
                                profilePhoto: URL,
                            });

                            const updatedUserSnap = await getDoc(docRef);

                            const updatedUser = updatedUserSnap.data();

                            res.status(200).json(updatedUser);
                        });
                    });
                } catch (error) {
                    console.error("error", error);
                    return res.status(error["status"] ? error["status"] : 500);
                }
            } else {
                const { uid } = fields;

                const docRef = doc(db, `users`, uid);
                await updateDoc(docRef, { ...fields });

                const updatedUserSnap = await getDoc(docRef);

                const updatedUser = updatedUserSnap.data();

                res.status(200).json(updatedUser);
            }
        });
    } catch (error) {
        console.error(error["error"] ? error["error"] : error);
        return res.status(error["status"] ? error["status"] : 500);
    }
}
