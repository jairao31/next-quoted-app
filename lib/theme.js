import { border, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const overrides = {
    colors: {
        brand: {
            50: "#FFFFFF",
            100: "#FEF9A7",
            300: "#FAC213",
            500: "#F77E21",
            700: "#D61C4E",
            800: "#D11145",
            900: "#000000",
        },
    },
    components: {
        Input: {
            baseStyle: {
                field: {
                    outline: "1px solid black",
                    borderColor: "transparent",
                },
            },
        },
        Textarea: {
            baseStyle: {
                borderRadius: "12px",
                outline: "2px solid black",
                borderColor: "transparent",
                ":focus": {
                    outline: "none",
                    borderColor: "transparent",
                    boxShadow: "none!important",
                },
                ":focus-visible": {
                    outline: "none",
                    borderColor: "transparent",
                    boxShadow: "none",
                },
                _focus: {
                    outline: "none",
                    borderColor: "transparent",
                    boxShadow: "none",
                },
            },
        },
        EditableTextarea: {
            baseStyle: {
                _focus: {
                    outline: "none",
                    borderColor: "transparent",
                    boxShadow: "none",
                },
            },
        },
        Modal: {
            baseStyle: {
                position: "fixed",
                top: "25vw",
                left: "25vw",
            },
        },
    },
};

export default extendTheme(
    overrides,
    withDefaultColorScheme({ colorScheme: "brand" })
);
