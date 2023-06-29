import { Box, Button, Container, Text, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import CommonField from "../common/CommonField";
import {
    validateEmail,
    validatePassword,
} from "@component/lib/utils/form-validations";
import { AuthContext } from "@component/context/AuthContext";

const RegisterForm = ({ setMode }) => {
    const { handleRegister } = useContext(AuthContext);

    const toast = useToast();

    return (
        <>
            <Text fontSize={"2xl"} mt={"8%"} fontWeight={"bold"}>
                Sign Up
            </Text>
            <Container maxW={"sm"} mt={"3%"}>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    onSubmit={async (values, actions) => {
                        try {
                            const { email, password, confirmPassword } = values;
                            if (password !== confirmPassword) {
                                toast({
                                    title: "Both passwords should match!",
                                    status: "warning",
                                    position: "bottom-left",
                                    variant: "subtle",
                                });
                                return actions.setSubmitting(false);
                            }
                            await handleRegister(email, password);
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
                                validate={validatePassword}
                            />
                            <CommonField
                                name="confirmPassword"
                                label="Confirm Password"
                                type={"password"}
                                validate={validatePassword}
                            />
                            <Box
                                // maxW={'sm'}
                                display={"flex"}
                                justifyContent={"space-between"}
                                mt={"3%"}
                            >
                                <Button
                                    variant="ghost"
                                    color={"blue.400"}
                                    onClick={() => setMode(0)}
                                >
                                    Have been here before?
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
                                    opacity={1}
                                    bg={"brand.700"}
                                >
                                    Register
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Container>
        </>
    );
};

export default RegisterForm;
