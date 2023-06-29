export const validateEmail = (value) => {
    if (!value) return;
    let error;
    if (
        !value
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    ) {
        error = "invalid email";
    }
    return error;
};

export const validatePassword = (value) => {
    if (!value) return;
    if (value.trim().length < 4) {
        return "should be atleast 4 characters long";
    }
};

export const validateConfirmPasssword = (value, password) => {
    if (!value) return;
    if (value !== password) return "both the passwords should match";
};
