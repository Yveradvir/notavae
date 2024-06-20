import * as Yup from "yup";

export interface ChangePasswordValues {
    password: string;
    confirm: string;
    new_password: string;
}

export const ChangePasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    confirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Field is required'),    
    new_password: Yup.string()
        .notOneOf([Yup.ref('password')], 'Passwords must not match')
        .required('Field is required'),
})