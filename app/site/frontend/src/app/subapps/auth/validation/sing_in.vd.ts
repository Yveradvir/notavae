import * as Yup from "yup";

export interface SignInValues {
    username: string;
    password: string;
    confirm: string;
}

export const SignInSchema = Yup.object().shape({
    username: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    password: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    confirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Field is required'),
})