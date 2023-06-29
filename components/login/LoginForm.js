import { Box, Button, Container, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import CommonField from "../common/CommonField";
import { validateEmail } from "@component/lib/utils/form-validations";
import { AuthContext } from "@component/context/AuthContext";

const LoginForm = ({ setMode }) => {
    const { handleLogin } = useContext(AuthContext);

    return (
        <>
            <Text fontSize={"2xl"} mt={"8%"} fontWeight={"bold"}>
                Sign In
            </Text>
            <Container maxW={"sm"} mt={"3%"}>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    onSubmit={async (values, actions) => {
                        try {
                            const { email, password } = values;
                            await handleLogin(email, password);
                            setTimeout(() => {
                                actions.setSubmitting(false);
                            }, 3000);
                        } catch (error) {
                            console.log(error);
                            actions.setSubmitting(false);
                        }
                    }}
                >
                    {(props) => (
                        <Form>
                            <CommonField
                                validate={validateEmail}
                                name="email"
                                label="Email"
                            />
                            <CommonField
                                name="password"
                                label="Password"
                                type={"password"}
                            />
                            <Box
                                display={"flex"}
                                justifyContent={"space-between"}
                                mt={"3%"}
                            >
                                <Button
                                    variant="ghost"
                                    color={"blue.400"}
                                    onClick={() => setMode(1)}
                                >
                                    Here for the first time?
                                </Button>
                                <Button
                                    isDisabled={
                                        props.isValidating ||
                                        !props.isValid ||
                                        Object.values(props.values).some(
                                            (i) => i === ""
                                        )
                                    }
                                    type="submit"
                                    isLoading={props.isSubmitting}
                                    bg={"brand.700"}
                                    opacity={1}
                                >
                                    Login
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Container>
        </>
    );
};

export default LoginForm;
