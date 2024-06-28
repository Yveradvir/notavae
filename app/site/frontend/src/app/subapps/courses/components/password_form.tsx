import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { TextField, Button, Box } from "@mui/material";
import {
    PasswordedSchema,
    PasswordedValues,
} from "@modules/components/header/modals/validation/passworded.vd";
import { EntityId } from "@reduxjs/toolkit";
import { useAppDispatch } from "@modules/reducers";
import { joinToCourse } from "@modules/reducers/slices/courses/my_courses/thunks/join_to_course.thunk";
import { useNavigate } from "react-router-dom";
import { RejectedError } from "@modules/constants/rejector.const";

interface PasswordFormProps {
    error: string | null;
    id: EntityId;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ error, id }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [globalError, setGlobalError] = useState<string | null>(error);

    const onSubmit = async (
        values: PasswordedValues,
        actions: FormikHelpers<PasswordedValues>
    ) => {
        setGlobalError(null);

        const thunk = await dispatch(
            joinToCourse({ course_id: id, password: values.password })
        );
        console.log("PasswordForm", thunk);
        
        if (thunk.meta.requestStatus === "rejected") {
            const _error = thunk.payload as RejectedError

            navigate(
                (_error.detail == "409") 
                ? `/error/${_error.status_code}/${_error.detail}` 
                : `/c/${id}`
            );
        }

        actions.setSubmitting(false);
    };

    return (
        <Box mt={2}>
            <Formik
                initialValues={{ password: "", confirm: "" }}
                validationSchema={PasswordedSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched, getFieldProps, isSubmitting }) => (
                    <Form>
                        <Box mb={2}>
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                {...getFieldProps("password")}
                                error={
                                    touched.password && Boolean(errors.password)
                                }
                                helperText={touched.password && errors.password}
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                {...getFieldProps("confirm")}
                                error={
                                    touched.confirm && Boolean(errors.confirm)
                                }
                                helperText={touched.confirm && errors.confirm}
                            />
                        </Box>
                        {globalError && (
                            <Box mb={2} style={{ color: "red" }}>
                                {globalError}
                            </Box>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isSubmitting}
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default PasswordForm;
