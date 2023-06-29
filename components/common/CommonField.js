import {
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import { Field } from "formik";
import React from "react";

const CommonField = ({ name, validate, label, type }) => {
    return (
        <Box mt={"10px"}>
            <Field name={name} validate={validate ? validate : null}>
                {({ field, form }) => (
                    <FormControl
                        isInvalid={form.errors[name] && form.touched[name]}
                    >
                        <FormLabel>{label}</FormLabel>
                        <Input {...field} placeholder={name} type={type} />
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                )}
            </Field>
        </Box>
    );
};

export default CommonField;
