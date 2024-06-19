import React, { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { TextField, Button, Box, Grid, Paper, Typography } from "@mui/material";
import ImageField from "@modules/components/image_field";
import { SignUpSchema, SignUpValues } from "./validation/sign_up.vd";
import Layout from "@modules/components/layout";
import { LaunchedAxios } from "@modules/api";
import { check_error } from "@modules/utils/check_funcs";
import { AxiosError } from "axios";

const SignUpForm: React.FC = () => {
    const [globalError, setGlobalError] = useState<string | null>(null);

    const initialValues: SignUpValues = {
        username: "",
        email: "",
        password: "",
        confirm: "",
        birth: "",
        image: "",
    };

    const onFormSubmit = async (
        values: SignUpValues,
        actions: FormikHelpers<SignUpValues>
    ) => {
        setGlobalError(null);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirm, ...body } = values;
        body.birth = new Date(body.birth).toISOString();

        try {
            const response = await LaunchedAxios.post("/a/signup", body);
            
            if (response.status === 201) {
                console.log("Created");
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
                        Sign Up
                    </Typography>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={SignUpSchema}
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
                                    <Field
                                        as={TextField}
                                        name="email"
                                        label="Email"
                                        type="email"
                                        variant="outlined"
                                        fullWidth
                                        error={touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
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
                                <Box mb={2}>
                                    <Field
                                        as={TextField}
                                        name="birth"
                                        label="Date of Birth"
                                        type="date"
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={touched.birth && !!errors.birth}
                                        helperText={touched.birth && errors.birth}
                                    />
                                </Box>
                                <Box mb={2}>
                                    <ImageField />
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

export default SignUpForm;
