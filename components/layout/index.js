import {
    Box,
    Flex,
    HStack,
    IconButton,
    Text,
    useToast,
} from "@chakra-ui/react";
import { AuthContext } from "@component/context/AuthContext";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { BiLogOut } from "react-icons/bi";
import { MdArrowBack } from "react-icons/md";
import { TiUser } from "react-icons/ti";

const Layout = ({ children }) => {
    const { handleLogout } = useContext(AuthContext);

    const router = useRouter();

    const toast = useToast();

    return (
        <Box w={"100%"} h={"100vh"} bg={"brand.50"} position={"relative"}>
            <HStack
                justifyContent={"space-between"}
                px={2}
                py={3}
                w={"100%"}
                backgroundColor={"brand.700"}
                color={"white"}
                position={"absolute"}
                top={0}
                zIndex={9}
            >
                {router.pathname !== "/home" ? (
                    <IconButton
                        icon={<MdArrowBack fontSize={"25px"} />}
                        variant={"ghost"}
                        onClick={() => router.back()}
                    />
                ) : (
                    <Text fontSize={"3xl"} fontWeight={"bold"}>
                        Quoted
                    </Text>
                )}

                <Flex>
                    <IconButton
                        icon={<TiUser fontSize={"25px"} />}
                        variant={"ghost"}
                        onClick={() => router.push("/profile")}
                    />
                    <IconButton
                        icon={<BiLogOut fontSize={"25px"} />}
                        variant={"ghost"}
                        onClick={() => {
                            handleLogout();
                            setTimeout(
                                () =>
                                    toast({
                                        title: "You have been logged out!",
                                        status: "info",
                                        position: "bottom-left",
                                        variant: "subtle",
                                    }),
                                5000
                            );
                        }}
                    />
                </Flex>
            </HStack>
            <Box
                h={"100vh"}
                w={"100%"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
