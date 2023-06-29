import React, { useContext, useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import LoginForm from "@component/components/login/LoginForm";
import RegisterForm from "@component/components/login/RegisterForm";
import { AuthContext } from "@component/context/AuthContext";
import { useRouter } from "next/router";

const Login = () => {
    const [mode, setMode] = useState(0);

    const { user } = useContext(AuthContext);

    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        router.push("/home");
    }, [user]);

    return (
        <Box
            w={"100%"}
            h={"100vh"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            // backgroundColor={"brand.300"}
        >
            <Box borderRadius={10} bg={"brand.700"} p={3} w={"fit-content"}>
                <Text fontSize={"4xl"} color={"brand.50"} fontWeight={"bold"}>
                    Quoted...
                </Text>
                <Text textAlign={"right"} color={"brand.300"} fontSize={"xs"}>
                    Unsaid are quoted
                </Text>
            </Box>
            {mode === 0 ? (
                <LoginForm setMode={(e) => setMode(e)} />
            ) : (
                <RegisterForm setMode={(e) => setMode(e)} />
            )}
        </Box>
    );
};

export default Login;
