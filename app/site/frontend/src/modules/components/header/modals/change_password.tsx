import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { check_error } from "@modules/utils/check_funcs";
import { AxiosError } from "axios";
import { useState } from "react";
import {
    ChangePasswordSchema,
    ChangePasswordValues,
} from "./validation/change_password.vd";

interface ChangePasswordModalI {
    open: boolean;
    callback: (body: {password: string; new_password: string}) => void;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalI> = ({
    open,
    callback,
    onClose,
}) => {
    const initialValues: ChangePasswordValues = {
        password: "",
        confirm: "",
        new_password: "",
    };
    const [globalError, setGlobalError] = useState<string | null>(null);

    const onFormSubmit = async (
        values: ChangePasswordValues,
        actions: FormikHelpers<ChangePasswordValues>
    ) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirm, ...body } = values;
            callback(body);
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
                <Typography>Change your password</Typography>
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onFormSubmit}
                    validationSchema={ChangePasswordSchema}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Box mb={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Field
                                            as={TextField}
                                            name="password"
                                            label="Password"
                                            type="password"
                                            variant="outlined"
                                            fullWidth
                                            error={
                                                touched.password &&
                                                !!errors.password
                                            }
                                            helperText={
                                                touched.password &&
                                                errors.password
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            as={TextField}
                                            name="confirm"
                                            label="Confirm Password"
                                            type="password"
                                            variant="outlined"
                                            fullWidth
                                            error={
                                                touched.confirm &&
                                                !!errors.confirm
                                            }
                                            helperText={
                                                touched.confirm &&
                                                errors.confirm
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mt={2}>
                                <Field
                                    as={TextField}
                                    name="new_password"
                                    label="New Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    error={
                                        touched.new_password && !!errors.new_password
                                    }
                                    helperText={
                                        touched.new_password && errors.new_password
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

export default ChangePasswordModal;
