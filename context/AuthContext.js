import { useToast } from "@chakra-ui/react";
import { auth } from "@component/lib/firebase-config";
import axios from "axios";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const { uid, email } = user;
                const result = await axios.get(`/api/getUser?uid=${uid}`);
                const exists = result.data.exists;
                if (exists) {
                    setUser(result.data.data);
                } else {
                    const result = await axios.post("/api/createUser", {
                        uid: uid,
                        email: email,
                        quotes: [],
                    });
                    setUser(result.data);
                }
                setLoading(false);
                // ...
            } else {
                setUser(null);
                router.push("/");
                setLoading(false);
                // User is signed out
                // ...
            }
        });
    }, []);

    const handleRegister = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Signed in
                    toast({
                        title: "User registered successfully!",
                        status: "success",
                        position: "bottom-left",
                        variant: "subtle",
                    });
                    setTimeout(() => router.push("/home"), 2000);
                })
                .catch((e) => {
                    console.log(e.message);
                    toast({
                        title: `${e.code}: ${e.message}`,
                        status: "error",
                        position: "bottom-left",
                        variant: "subtle",
                    });
                    throw { error: true };
                });
        } catch (error) {
            throw error;
        }
    };

    const handleLogin = async (email, password) => {
        try {
            signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    const result = await axios.get(
                        `/api/getUser?uid=${user.uid}`
                    );
                    setUser(result.data.data);
                    toast({
                        title: `Welcome ${result.data.data.displayName}!`,
                        status: "success",
                        position: "bottom-left",
                        variant: "subtle",
                    });
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast({
                        title: `${errorCode}: ${errorMessage}`,
                        status: "error",
                        position: "bottom-left",
                        variant: "subtle",
                    });
                    throw { errorMessage };
                });
        } catch (error) {
            throw error;
        }
    };

    const handleLogout = () => {
        signOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{
                handleRegister,
                handleLogin,
                user,
                loading,
                handleLogout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
