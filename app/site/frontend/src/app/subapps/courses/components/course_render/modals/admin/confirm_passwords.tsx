import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { check_error } from "@modules/utils/check_funcs";
import { AxiosError } from "axios";
import { useState } from "react";
import * as Yup from "yup"
import { LaunchedAxios } from "@modules/api";
import { CourseEntity } from "@modules/reducers/slices/courses/const";
import { useNavigate } from "react-router-dom";

interface ConfirmPasswordsValues {
    user_password: string;
    course_password: string;
}

export const ConfirmPasswordsSchema = Yup.object().shape({
    user_password: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
    course_password: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .required("Field is required"),
})

interface ConfirmPasswordsI {
    open: boolean;
    onClose: () => void;
    course: CourseEntity;
}

const ConfirmPasswords: React.FC<ConfirmPasswordsI> = ({
    open,
    onClose,
    course
}) => {
    const navigate = useNavigate();
    const initialValues: ConfirmPasswordsValues = { user_password: "", course_password: "" };
    const [globalError, setGlobalError] = useState<string | null>(null);

    const onFormSubmit = async (
        values: ConfirmPasswordsValues,
        actions: FormikHelpers<ConfirmPasswordsValues>
    ) => {
        try {
            const url = `/c/single/${course.id}/`
            const password_confrimation = await LaunchedAxios.post(url + 'predelete', values)

            if (password_confrimation.status === 200) {
                const response = await LaunchedAxios.delete(url)

                if (response.status === 200) {
                    navigate('/c/my')
                }
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setGlobalError(check_error(error));
            }
        }

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
                    validationSchema={ConfirmPasswordsSchema}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="user_password"
                                    label="Your password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    error={
                                        touched.user_password && !!errors.user_password
                                    }
                                    helperText={
                                        touched.user_password && errors.user_password
                                    }
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="course_password"
                                    label="Course Password (if it isn't public)"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    error={touched.course_password && !!errors.course_password}
                                    helperText={
                                        touched.course_password && errors.course_password
                                    }
                                />
                            </Box>
                            <Box mt={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Sign Up
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

export default ConfirmPasswords;
