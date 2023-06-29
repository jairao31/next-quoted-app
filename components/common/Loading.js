import { Box, CircularProgress, Text } from "@chakra-ui/react";
import React from "react";

const Loading = ({ label }) => {
    return (
        <Box
            w={"100vw"}
            h={"100vh"}
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"column"}
            alignItems={"center"}
        >
            <CircularProgress isIndeterminate color="green.300" />
            <Text mt={3} fontSize={"md"}>
                {label}
            </Text>
        </Box>
    );
};

export default Loading;
