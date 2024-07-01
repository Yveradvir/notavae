import Layout from "@modules/components/layout";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { CourseSchema, CourseValues } from "./validation/courses.vd";
import ImageField from "@modules/components/image_field";
import { useState } from "react";
import { check_error } from "@modules/utils/check_funcs";
import { AxiosError } from "axios";
import { LaunchedAxios } from "@modules/api";
import { useNavigate } from "react-router-dom";
import { SwitchChip } from "@modules/components/header/components";
import { InfoOutlined } from "@mui/icons-material";
import { useAppDispatch } from "@modules/reducers";
import { ccMembershipsActions } from "@modules/reducers/slices/cc_memberships";
import { ccAssociationsActions } from "@modules/reducers/slices/cc_associations";

const NewCourseForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [globalError, setGlobalError] = useState<string | null>(null);
    const initialValues: CourseValues = {
        name: "",
        description: "",
        password: "",
        confirm: "",
        image: "",
    };

    const onFormSubmit = async (
        values: CourseValues,
        actions: FormikHelpers<CourseValues>
    ) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {confirm, ...body} = values;
            const response = await LaunchedAxios.post("/c/new", body)

            if (response.status === 201) {
                await dispatch(ccMembershipsActions.reset())
                await dispatch(ccAssociationsActions.reset())
                navigate(`/c/${response.data.subdata}`, {replace: true})
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
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Paper
                    elevation={3}
                    sx={{ padding: 4, maxWidth: 500, width: "100%" }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Sign Up
                    </Typography>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={CourseSchema}
                        onSubmit={onFormSubmit}
                    >
                        {({touched, errors}) => (
                            <Form>
                                <Box mb={2}>
                                    <Field
                                        as={TextField}
                                        name="name"
                                        label="Name"
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
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Field
                                                as={TextField}
                                                name="password"
                                                label="Password for group"
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
                                        <SwitchChip
                                            sx={{
                                                marginLeft: 2.5,
                                                marginTop: 1
                                            }} 
                                            icon={<InfoOutlined/>} 
                                            label="Your group will be private if you enter it. Otherwise - public"
                                            onClick={() => {}}
                                        />
                                    </Grid>
                                </Box>
                                <Box mb={2}>
                                    <Field
                                        name="description"
                                        type="text"
                                        as={TextField}
                                        label="Description"
                                        multiline
                                        fullWidth
                                        error={
                                            touched.description &&
                                            !!errors.description
                                        }
                                        helperText={
                                            touched.description &&
                                            errors.description
                                        }
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

export default NewCourseForm;
