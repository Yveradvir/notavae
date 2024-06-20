import * as Yup from "yup";

export interface PasswordedValues {
    password: string;
    confirm: string;
}

export const PasswordedSchema = Yup.object().shape({
    password: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    confirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Field is required'),
})