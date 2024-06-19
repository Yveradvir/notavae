import { Box, Button, Dialog, DialogContent, TextField } from "@mui/material";
import { PasswordedSchema, PasswordedValues } from "./validation/passworded.vd";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { LaunchedAxios } from "@modules/api";
import { check_error } from "@modules/utils/check_funcs";
import { AxiosError } from "axios";
import { useState } from "react";

interface PasswordedModalI {
    open: boolean;
    callback: (password: string) => void;
    onClose: () => void;
}

const PasswordedModal: React.FC<PasswordedModalI> = ({
    open,
    callback,
    onClose,
}) => {
    const initialValues: PasswordedValues = { password: "", confirm: "" };
    const [globalError, setGlobalError] = useState<string | null>(null);

    const onFormSubmit = async (
        values: PasswordedValues,
        actions: FormikHelpers<PasswordedValues>
    ) => {
        try {
            const response = await LaunchedAxios.post("/a/password_check", {
                password: values.password,
            });

            if (response.status === 200) {
                callback(values.password);
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
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onFormSubmit}
                    validationSchema={PasswordedSchema}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    error={
                                        touched.password && !!errors.password
                                    }
                                    helperText={
                                        touched.password && errors.password
                                    }
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="confirm"
                                    label="Confirm Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    error={touched.confirm && !!errors.confirm}
                                    helperText={
                                        touched.confirm && errors.confirm
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

export default PasswordedModal;
