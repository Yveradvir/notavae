import { CourseEntity } from "@modules/reducers/slices/courses/const";
import { Button, Dialog, DialogContent, Grid, Paper, Typography } from "@mui/material";
import ConfirmPasswords from "./confirm_passwords";
import { useState } from "react";

interface AdminModalI {
    open: boolean;
    onClose: () => void;
    course: CourseEntity;
}

const AdminModal: React.FC<AdminModalI> = ({
    onClose, open, course
}) => {
    const [confirmPasswordsOpen, setConfirmPasswordsOpen] = useState<boolean>();

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <Grid spacing={2}>
                    <Paper>
                        <Typography>
                            Change current topic
                        </Typography>
                        <Button
                            color="primary"
                        >
                            Change
                        </Button>
                    </Paper>
                    <Paper>
                        <Typography>
                            Add new association
                        </Typography>
                        <Button
                            color="primary"
                        >
                            Add
                        </Button>
                    </Paper>
                    <Paper>
                        <Typography>
                            Delete group
                        </Typography>
                        <Button
                            color="error"
                        >
                            Delete
                        </Button>
                        <ConfirmPasswords open={confirmPasswordsOpen as boolean} onClose={() => {setConfirmPasswordsOpen(false)}} course={course}/>
                    </Paper>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default AdminModal;