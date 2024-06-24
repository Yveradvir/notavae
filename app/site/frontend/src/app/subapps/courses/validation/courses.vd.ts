import * as Yup from "yup";

export interface CourseValues {
    name: string;
    description: string;
    password: string;
    confirm: string;
    image: string;
}

export const CourseSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    password: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .optional(),
    description: Yup.string()
        .min(10, "Minimum 10 letters")
        .max(1000, "Maximum 1000 letters")    
        .required("Field is required"),
    confirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .optional(),
    image: Yup.mixed()
        .optional()        
})