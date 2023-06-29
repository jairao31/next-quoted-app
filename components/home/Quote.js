import React, { useState } from "react";
import {
    Avatar,
    Flex,
    IconButton,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";

const Quote = ({
    q,
    like,
    user,
    editable,
    updateQuote,
    Disabled,
    deleteQuote,
}) => {
    const [disabled, setDisabled] = useState(false);

    return (
        <VStack
            w={"100%"}
            h={"120px"}
            bg={"brand.100"}
            p={"10px"}
            borderRadius={"lg"}
            justifyContent={"space-between"}
        >
            <Flex w={"100%"} gap={"10px"} h={"100%"}>
                <Avatar
                    my={"10px"}
                    src={q._user.profilePhoto}
                    name={q._user.displayName}
                />
                <Text pt={"20px"} w={"100%"} isTruncated>
                    {`"${q.quote}"`}
                </Text>
            </Flex>
            <Flex
                justifyContent={"space-between"}
                w={"100%"}
                h={"fit-content"}
                mt={"0px!important"}
            >
                <Flex>
                    {editable ? (
                        <Flex gap={"5px"}>
                            <IconButton
                                icon={<AiTwotoneEdit fontSize={"22px"} />}
                                fontSize={"md"}
                                variant={"ghost"}
                                onClick={() => updateQuote()}
                            />
                            <IconButton
                                icon={<AiFillDelete fontSize={"22px"} />}
                                fontSize={"md"}
                                variant={"ghost"}
                                onClick={() => deleteQuote()}
                            />
                        </Flex>
                    ) : (
                        <>
                            <IconButton
                                variant={"ghost"}
                                icon={
                                    q.likes[`${user}`] === "" ? (
                                        <FcLike fontSize={"25px"} />
                                    ) : (
                                        <FcLikePlaceholder fontSize={"25px"} />
                                    )
                                }
                                fontSize={"md"}
                                isDisabled={Disabled}
                                onClick={
                                    like
                                        ? () => {
                                              like();
                                              setDisabled(true);
                                              setTimeout(
                                                  () => setDisabled(false),
                                                  2000
                                              );
                                          }
                                        : () => {}
                                }
                            />
                            {Object.keys(q.likes).length > 0 && (
                                <Text pt="10px">
                                    {Object.keys(q.likes).length}
                                </Text>
                            )}
                        </>
                    )}
                </Flex>
                <Text fontSize={"sm"} pt="5px">
                    {moment(new Date(q.created_on)).fromNow(true)}
                </Text>
            </Flex>
        </VStack>
    );
};

export default Quote;
