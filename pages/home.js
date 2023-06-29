import {
    Box,
    CircularProgress,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import Loading from "@component/components/common/Loading";
import AddButton from "@component/components/home/AddButton";
import AddQuoteModal from "@component/components/home/AddQuoteModal";
import Quote from "@component/components/home/Quote";
import Layout from "@component/components/layout";
import { AuthContext } from "@component/context/AuthContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

const Home = () => {
    const [quotes, setQuotes] = useState([]);
    const [gettingQuotes, setGettingQuotes] = useState(true);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        if (!user) return;

        const getQuotes = async () => {
            setGettingQuotes(true);
            const result = await axios.get("/api/getAllQuotes");
            setQuotes(result.data.docs);
            setGettingQuotes(false);
        };
        getQuotes();
    }, [user]);

    const like = async (requestId) => {
        try {
            const updatedQuote = await axios.post("/api/likeQuote", {
                requestId,
                uid: user.uid,
            });
            const data = updatedQuote.data;
            setQuotes((prev) => {
                return prev.map((i) =>
                    i.id === requestId ? { ...i, likes: data.likes } : i
                );
            });
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return <Loading label={"getting session"} />;
    }

    return (
        <Layout>
            <VStack
                maxH={"98%"}
                w={"100%"}
                gap={"10px"}
                px={"10px"}
                pt={"100px"}
                pb={"50px"}
                overflowY={"auto"}
            >
                {gettingQuotes ? (
                    <Box my="auto">
                        <CircularProgress isIndeterminate color="green.300" />
                    </Box>
                ) : quotes.length === 0 ? (
                    <Text
                        my="auto"
                        color={"gray.500"}
                        textAlign={"center"}
                        fontSize={"xl"}
                        px="10vw"
                    >
                        Noone has quoted yet! Come back later.
                    </Text>
                ) : (
                    <>
                        {quotes.map((i) => (
                            <Quote
                                key={i.id}
                                q={i}
                                like={() => like(i.id)}
                                user={user?.uid}
                            />
                        ))}
                    </>
                )}
            </VStack>

            <AddButton onClick={onOpen} />
            <AddQuoteModal
                isOpen={isOpen}
                onClose={onClose}
                addQuote={(q) =>
                    setQuotes((prev) => {
                        return [q, ...prev];
                    })
                }
            />
        </Layout>
    );
};

export default Home;
