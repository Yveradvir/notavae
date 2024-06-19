import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { TextField, Button, Box, Grid } from "@mui/material";
import ImageField from "@modules/components/image_field";
import { SignUpSchema, SignUpValues } from "./validation/sign_up.vd";
import Layout from "@modules/components/layout";
import { LaunchedAxios } from "@modules/api";

const SignUpForm: React.FC = () => {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {confirm, ...body} = values
        body.birth = new Date(body.birth).toISOString()
        console.log(body.birth);
        
        try {
            const response = await LaunchedAxios.post("/a/signup", body)
            
            if (response.status === 201) {
                console.log("Created");
            }
        } catch (error) {
            console.log("A PROBLEM");
        }
        actions.setSubmitting(false);
    };

    return (
        <Layout>
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
                                        error={
                                            touched.password &&
                                            !!errors.password
                                        }
                                        helperText={
                                            touched.password && errors.password
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
                                            touched.confirm && !!errors.confirm
                                        }
                                        helperText={
                                            touched.confirm && errors.confirm
                                        }
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
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default SignUpForm;
