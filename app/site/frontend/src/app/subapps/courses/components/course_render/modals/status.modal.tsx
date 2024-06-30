import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { changeStatusCc } from '@modules/reducers/slices/cc_memberships/thunks/change_status.thunk';
import { useAppDispatch } from '@modules/reducers';
import { PsychologyOutlined } from '@mui/icons-material';

interface StatusModalI {
    isMine: boolean;
    status: string | null;
    course_id: string;
}

const StatusSchema = Yup.object().shape({
    status: Yup.string()
        .max(50, 'Status must be 50 characters or less')
        .required('Status is required')
});

const StatusModal: React.FC<StatusModalI> = ({
    isMine, status, course_id
}) => {
    const dispatch = useAppDispatch();
    const [statusModalOpen, setStatusModalOpen] = useState<boolean>();
    const onClose = () => {setStatusModalOpen(false)}

    return (
        <>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => {setStatusModalOpen(true)}}
            >
                <PsychologyOutlined />
                Status
            </Button>

            <Dialog open={statusModalOpen as boolean} onClose={onClose}>
                <DialogTitle>Status</DialogTitle>
                <DialogContent>
                    <Typography>{status ? status : "Current user didn't make an status"}</Typography>
                    {isMine && (
                        <Formik
                            initialValues={{ status: '' }}
                            validationSchema={StatusSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                await dispatch(changeStatusCc({ course_id, status: values.status }));
                                setSubmitting(false);
                                onClose();
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <Field
                                        as={TextField}
                                        name="status"
                                        label="New Status"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        helperText={<ErrorMessage name="status" />}
                                    />
                                    <DialogActions>
                                        <Button onClick={onClose} color="primary">
                                            Cancel
                                        </Button>
                                        <Button type="submit" color="primary" disabled={isSubmitting}>
                                            Submit
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default StatusModal;
