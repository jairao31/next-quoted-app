import { IconButton } from "@chakra-ui/react";
import React from "react";
import { VscEdit } from "react-icons/vsc";

const AddButton = ({ onClick }) => {
    return (
        <IconButton
            w={"80px"}
            h={"80px"}
            borderRadius={"50%"}
            position={"absolute"}
            bottom={"10vh"}
            right={"5%"}
            bg={"brand.700"}
            icon={<VscEdit fontSize={"28px"} onClick={() => onClick()} />}
        />
    );
};

export default AddButton;
