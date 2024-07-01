import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { check_error } from "@modules/utils/check_funcs";
import { AxiosError } from "axios";
import { useState } from "react";
import * as Yup from "yup";
import { LaunchedAxios } from "@modules/api";
import { CourseEntity } from "@modules/reducers/slices/courses/const";
import { useNavigate } from "react-router-dom";

interface ChangeTopicValues {
    current_topic: string;
    course_password: string | null;
}

export const ChangeTopicSchema = Yup.object().shape({
    current_topic: Yup.string()
        .min(10, "Minimum 10 letters")
        .max(12000, "Maximum 12 000 letters")
        .optional(),
    course_password: Yup.string()
        .min(2, "Minimum 2 letters")
        .max(40, "Maximum 40 letters")
        .optional(),
});

interface ChangeTopicI {
    open: boolean;
    onClose: () => void;
    course: CourseEntity;
}

const ChangeTopic: React.FC<ChangeTopicI> = ({ open, onClose, course }) => {
    const navigate = useNavigate();
    const initialValues: ChangeTopicValues = {
        current_topic: "",
        course_password: "",
    };
    const [globalError, setGlobalError] = useState<string | null>(null);

    const onFormSubmit = async (
        values: ChangeTopicValues,
        actions: FormikHelpers<ChangeTopicValues>
    ) => {
        try {
            console.log(values);
            
            const response = await LaunchedAxios.patch(
                `/c/single/${course.id}/topic`,
                values
            );

            if (response.status === 200) {
                navigate(0);
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
                    validationSchema={ChangeTopicSchema}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Box mb={2}>
                                <Field
                                    name="current_topic"
                                    as={TextField}
                                    label="New current topic"
                                    multiline
                                    fullWidth
                                    error={
                                        touched.current_topic &&
                                        !!errors.current_topic
                                    }
                                    helperText={
                                        touched.current_topic &&
                                        errors.current_topic
                                    }
                                />
                            </Box>
                            {course.is_private && (
                                <Box mb={2}>
                                    <Field
                                        as={TextField}
                                        name="course_password"
                                        label="Course Password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                        error={
                                            touched.course_password &&
                                            !!errors.course_password
                                        }
                                        helperText={
                                            touched.course_password &&
                                            errors.course_password
                                        }
                                    />
                                </Box>
                            )}
                            <Box mt={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Change
                                </Button>
                            </Box>
                            {globalError && (
                                <Box color="error" sx={{ color: "error.main" }}>
                                    <Typography>{globalError}</Typography>
                                </Box>
                            )}
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeTopic;
