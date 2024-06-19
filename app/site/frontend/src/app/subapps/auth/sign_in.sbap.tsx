import React, { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { TextField, Button, Box, Grid, Paper, Typography } from "@mui/material";
import Layout from "@modules/components/layout";
import { LaunchedAxios } from "@modules/api";
import { check_error } from "@modules/utils/check_funcs";
import { AxiosError } from "axios";
import { SignInSchema, SignInValues } from "./validation/sing_in.vd";

const SignInForm: React.FC = () => {
    const [globalError, setGlobalError] = useState<string | null>(null);

    const initialValues: SignInValues = {
        username: "",
        password: "",
        confirm: "",
    };

    const onFormSubmit = async (
        values: SignInValues,
        actions: FormikHelpers<SignInValues>
    ) => {
        setGlobalError(null);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirm, ...body } = values;

        try {
            const response = await LaunchedAxios.post("/a/signin", body);
            
            if (response.status === 200) {
                console.log("Registered");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setGlobalError(check_error(error));
            }
        }

        actions.setSubmitting(false);
    };

    return (
        <Layout>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, width: '100%' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Sign In
                    </Typography>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={SignInSchema}
                        onSubmit={onFormSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Box mb={2}>
                                    <Field
                                        as={TextField}
                                        name="username"
                                        label="Username"
                                        variant="outlined"
                                        fullWidth
                                        error={touched.username && !!errors.username}
                                        helperText={touched.username && errors.username}
                                    />
                                </Box>
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
                                                error={touched.password && !!errors.password}
                                                helperText={touched.password && errors.password}
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
                                                error={touched.confirm && !!errors.confirm}
                                                helperText={touched.confirm && errors.confirm}
                                            />
                                        </Grid>
                                    </Grid>
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
                </Paper>
            </Box>
        </Layout>
    );
};

export default SignInForm;
