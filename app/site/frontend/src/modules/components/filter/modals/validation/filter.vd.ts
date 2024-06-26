import * as Yup from "yup";

export const FiltersValuesSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .default(null)
        .nullable()
        .optional(),
    am_i_author: Yup.number()
        .default(1)
        .oneOf([0, 1, 2])
        .required("Required"),
    newest: Yup.bool()
        .default(false)
});