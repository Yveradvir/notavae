import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { useState } from "react";
import { CourseEntity } from "@modules/reducers/slices/courses/const";
import { addCcAssociation } from "@modules/reducers/slices/cc_associations/thunk/add_association.thunk";
import { useAppDispatch } from "@modules/reducers";
import * as Yup from "yup"
import { RejectedError } from "@modules/constants/rejector.const";

interface AddAssoValues {
    name: string;
    password: string;
}

export const AddAssoSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    password: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .optional(),
})

interface AddAssoI {
    open: boolean;
    onClose: () => void;
    course: CourseEntity;
}

const AddAsso: React.FC<AddAssoI> = ({
    open,
    onClose,
    course
}) => {
    const dispatch = useAppDispatch();
    const initialValues: AddAssoValues = { name: "", password: "" };
    const [globalError, setGlobalError] = useState<string | null>(null);

    const onFormSubmit = async (
        values: AddAssoValues,
        actions: FormikHelpers<AddAssoValues>
    ) => {
        const thunk = await dispatch(addCcAssociation({associator_id: course.id, body: values}))
        
        if (thunk.meta.requestStatus === "rejected") setGlobalError((thunk.payload as RejectedError).detail)

        actions.setSubmitting(false);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography>You need to confirm this action</Typography>
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onFormSubmit}
                    validationSchema={AddAssoSchema}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="name"
                                    label="Name of associated group"
                                    variant="outlined"
                                    fullWidth
                                    error={
                                        touched.name && !!errors.name
                                    }
                                    helperText={
                                        touched.name && errors.name
                                    }
                                />
                            </Box>
                            <Box mb={2}>
                                {course.is_private && (<Field
                                    as={TextField}
                                    name="password"
                                    label="Course Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    error={touched.password && !!errors.password}
                                    helperText={
                                        touched.password && errors.password
                                    }
                                />)}
                            </Box>
                            <Box mt={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Add association
                                </Button>
                            </Box>
                            {globalError && (
                                <Box color="error" sx={{ color: "error.main" }}>
                                    {globalError}
                                </Box>
                            )}
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default AddAsso;
