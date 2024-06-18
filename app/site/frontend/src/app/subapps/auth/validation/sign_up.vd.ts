import * as Yup from "yup";

export interface SignUpValues {
    username: string;
    email: string;
    password: string;
    confirm: string;
    birth: string;
    image: string;
}

export const SignUpSchema = Yup.object().shape({
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
    email: Yup.string()
        .email("You should put here an email")
        .max(120, "Maximum 120 letters")
        .required("Field is required"),
    birth: Yup.date()
        .max(new Date(), "Date of birth must be in the past")
        .required("Field is required"),
    image: Yup.mixed()
        .optional()        
})