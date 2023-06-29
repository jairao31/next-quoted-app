import {
    Avatar,
    Box,
    Button,
    Editable,
    EditablePreview,
    EditableTextarea,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useEditableControls,
    useToast,
} from "@chakra-ui/react";
import { AuthContext } from "@component/context/AuthContext";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";

const AddQuoteModal = ({ isOpen, onClose, addQuote, edit, q, updateQuote }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, setUser } = useContext(AuthContext);
    const ref = useRef();
    const toast = useToast();

    useEffect(() => {
        if (q && ref.current) {
            ref.current.value = q.quote;
        }
    }, [q, ref.current]);

    const handleAdd = async (quote) => {
        try {
            const { displayName, profilePhoto, uid } = user;
            const newQuote = await axios.post("/api/createQuote", {
                quote,
                _user: { displayName, profilePhoto, uid },
            });
            const quoteData = newQuote.data;
            setUser((prev) => {
                return {
                    ...prev,
                    quotes: [...prev.quotes, quoteData.id],
                };
            });
            toast({
                title: "Quote posted!",
                status: "success",
                position: "bottom-left",
                variant: "subtle",
            });
            addQuote(quoteData);
        } catch (error) {
            toast({
                title: "Could not quote!",
                status: "error",
                position: "bottom-left",
                variant: "subtle",
            });
            throw error;
        }
    };

    const handleEdit = async (quote) => {
        try {
            const { uid } = user;
            const updatedQuote = await axios.put("/api/updateQuote", {
                quoteId: q.id,
                quote,
                uid,
            });

            const result = updatedQuote.data;
            updateQuote(result);
            toast({
                title: "Quote updated!",
                status: "success",
                position: "bottom-left",
                variant: "subtle",
            });
        } catch (error) {
            toast({
                title: "Could not update!",
                status: "error",
                position: "bottom-left",
                variant: "subtle",
            });
            throw error;
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const quote = ref.current.value;
            if (quote.trim().length === 0) return setError(true);
            setError(false);
            if (edit) {
                await handleEdit(quote);
            } else {
                await handleAdd(quote);
            }
            setLoading(false);
            onClose();
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(false);
        }
    };

    function EditableControls() {
        const { isEditing, getEditButtonProps } = useEditableControls();

        return (
            <Flex
                justifyContent="center"
                hidden={
                    ref?.current?.value?.trim()?.length > 0 || isEditing || q
                }
            >
                <Button variant="ghost" size="sm" {...getEditButtonProps()}>
                    What's on your mind?
                </Button>
            </Flex>
        );
    }

    return (
        <Modal
            isCentered
            isOpen={isOpen}
            onClose={() => onClose()}
            // styleConfig={{
            //     position:"fixed",
            //     top:"25vw !important",
            //     left:"25vw!important"
            // }}
        >
            <ModalOverlay />
            <ModalContent
                w={"90%"}
                // bg={'brand.300'}
            >
                <ModalHeader>
                    {edit ? "Edit quote" : "Quote something"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex gap={"10px"}>
                        <Avatar
                            src={user?.profilePhoto}
                            name={user?.displayName}
                        />
                        <Box w={"100%"}>
                            <Box
                                w={"100%"}
                                borderRadius={"12px"}
                                border={
                                    error ? "1px solid red" : "1px solid black"
                                }
                                pt={7}
                                pb={5}
                                px={2}
                                mb={1}
                            >
                                <Text lineHeight={"0ch"} fontSize={"4xl"}>
                                    "
                                </Text>
                                <Editable
                                    mb={2}
                                    textAlign={"center"}
                                    defaultValue={q?.quote}
                                >
                                    <EditableControls />
                                    <EditablePreview />
                                    <EditableTextarea
                                        w={"100%"}
                                        ref={ref}
                                        _focus={{ boxShadow: "none" }}
                                    />
                                </Editable>
                                <Text
                                    lineHeight={"0ch"}
                                    textAlign={"right"}
                                    fontSize={"4xl"}
                                >
                                    "
                                </Text>
                            </Box>
                            {error && (
                                <Text
                                    fontWeight={"thin"}
                                    as={"span"}
                                    color={"red"}
                                >
                                    Quote can't be empty!
                                </Text>
                            )}
                        </Box>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button bg={"brand.300"} onClick={handleSubmit}>
                        {edit ? "Save" : "Quote"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddQuoteModal;
