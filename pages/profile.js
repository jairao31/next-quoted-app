import {
    Avatar,
    Box,
    Button,
    Flex,
    Input,
    Text,
    VStack,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import Loading from "@component/components/common/Loading";
import AddQuoteModal from "@component/components/home/AddQuoteModal";
import Quote from "@component/components/home/Quote";
import Layout from "@component/components/layout";
import DeleteQuoteModal from "@component/components/profile/DeleteQuoteModal";
import { AuthContext } from "@component/context/AuthContext";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";

const Profile = () => {
    const [quotes, setQuotes] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedQuote, setSelectedQuote] = useState();
    const [gettingQuotes, setGettingQuotes] = useState();

    const { user, loading, setUser } = useContext(AuthContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: editOpen,
        onOpen: onEdit,
        onClose: onEditClose,
    } = useDisclosure();

    const ref = useRef();
    const dpRef = useRef();

    const toast = useToast();

    useEffect(() => {
        if (!user) return;
        const getQuotes = async () => {
            try {
                setGettingQuotes(true);
                const quotes = await axios.get(
                    `/api/getMyQuotes?uid=${user.uid}`
                );
                const data = quotes.data;
                setQuotes(data.docs);
                setGettingQuotes(false);
            } catch (error) {
                console.log(error);
                setGettingQuotes(false);
            }
        };
        getQuotes();
    }, [user]);

    const handleSave = async () => {
        try {
            if (ref.current.value.trim().length < 0) return;
            setUpdating(true);
            const formData = new FormData();
            if (preview) {
                formData.append("pic", file);
            } else {
                formData.append("pic", user.profilePhoto);
            }
            formData.append("displayName", ref.current.value);
            formData.append("uid", user.uid);
            const updatedUser = await axios.post(
                "/api/updateProfile",
                formData
            );
            setUpdating(false);
            setUser(updatedUser.data);
            setPreview(null);
            setFile(null);
            toast({
                title: "User updated!",
                status: "success",
                position: "bottom-left",
                variant: "subtle",
            });
        } catch (error) {
            toast({
                title: "Could not update user!",
                status: "error",
                position: "bottom-left",
                variant: "subtle",
            });
            console.log(error);
        }
    };

    const handlePreview = (e) => {
        let f = e.target.files[0];
        let url = URL.createObjectURL(f);
        setPreview(url);
        setFile(f);
    };

    const updateQuote = (r) => {
        setQuotes((prev) => {
            return prev.map((i) => (i.id === r.id ? r : i));
        });
    };

    const handleDelete = (id) => {
        setQuotes((prev) => {
            return prev.filter((i) => i.id !== id);
        });
    };

    if (loading || gettingQuotes) return <Loading />;

    return (
        <Layout>
            <VStack
                w="100%"
                pt="40px"
                px={"20px"}
                pb="20px"
                maxH={"24%"}
                borderBottom={"2px solid black"}
                overflow={"hidden"}
            >
                <Flex w={"100%"} justifyContent={"space-between"} gap={"10px"}>
                    <VStack justifyContent={"center"} alignItems={"center"}>
                        <div>
                            <Avatar
                                size={"xl"}
                                src={preview || user?.profilePhoto}
                                name={user?.displayName}
                                cursor={"pointer"}
                                onClick={() => {
                                    dpRef.current.click();
                                }}
                            />
                        </div>
                    </VStack>
                    <Box w={"100%"}>
                        <Input
                            type="file"
                            name="pic"
                            display={"none"}
                            ref={dpRef}
                            onChange={handlePreview}
                            accept="image/*"
                        />
                        <Input
                            defaultValue={user?.displayName}
                            ref={ref}
                            my="10px"
                        />
                        <Button
                            w={"100%"}
                            isLoading={updating}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </Box>
                </Flex>
            </VStack>
            <VStack
                maxH={"73%"}
                h={"71%"}
                w={"100%"}
                gap={"10px"}
                px={"10px"}
                overflow={"hidden"}
                overflowY={"auto"}
                bottom={0}
                pb="40px"
                pt={"20px"}
            >
                {quotes.length > 0 ? (
                    quotes?.map((i) => (
                        <Quote
                            key={i.id}
                            q={i}
                            user={user?.uid}
                            editable={true}
                            deleteQuote={() => {
                                setSelectedQuote(i);
                                onOpen();
                            }}
                            updateQuote={() => {
                                setSelectedQuote(i);
                                onEdit();
                            }}
                        />
                    ))
                ) : (
                    <Text
                        my="auto"
                        color={"gray.500"}
                        textAlign={"center"}
                        fontSize={"xl"}
                        px="10vw"
                    >
                        You haven't quoted anything yet!
                    </Text>
                )}
            </VStack>
            <DeleteQuoteModal
                isOpen={isOpen}
                onClose={onClose}
                q={selectedQuote?.id}
                user={user?.uid}
                Delete={(id) => handleDelete(id)}
            />
            <AddQuoteModal
                edit={true}
                isOpen={editOpen}
                onClose={onEditClose}
                q={selectedQuote}
                updateQuote={(r) => updateQuote(r)}
            />
        </Layout>
    );
};

export default Profile;
