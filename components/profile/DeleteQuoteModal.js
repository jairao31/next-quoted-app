import {
    Button,
    CircularProgress,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Quote from "../home/Quote";

const DeleteQuoteModal = ({ isOpen, onClose, q, user, Delete }) => {
    const [quote, setQuote] = useState();

    const toast = useToast();

    useEffect(() => {
        if (!q) return;
        const getQuote = async () => {
            const result = await axios.get(`/api/getQuote?id=${q}`);
            const data = result.data;
            setQuote(data);
        };

        getQuote();
    }, [q]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/deleteQuote?id=${q}`);
            Delete(q);
            onClose();
            toast({
                title: "Quote deleted!",
                status: "success",
                position: "bottom-left",
                variant: "subtle",
            });
        } catch (error) {
            toast({
                title: "Could not delete!",
                status: "error",
                position: "bottom-left",
                variant: "subtle",
            });
            console.log(error);
        }
    };

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent w={"90%"}>
                <ModalHeader>Are your sure?</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex w={"100%"} justifyContent={"center"}>
                        {quote ? (
                            <Quote q={quote} Disabled={true} user={user} />
                        ) : (
                            <CircularProgress
                                isIndeterminate
                                color="green.300"
                            />
                        )}
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="solid"
                        bg={"red.500"}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteQuoteModal;
