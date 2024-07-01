import { CourseEntity } from "@modules/reducers/slices/courses/const";
import { Button, Dialog, DialogContent, Grid, Paper, Typography } from "@mui/material";
import ConfirmPasswords from "./confirm_passwords";
import { useState } from "react";
import AddAsso from "./add_asso";
import ChangeTopic from "./change_topic";

interface AdminModalI {
    open: boolean;
    onClose: () => void;
    course: CourseEntity;
}

const AdminModal: React.FC<AdminModalI> = ({
    onClose, open, course
}) => {
    const [confirmPasswordsOpen, setConfirmPasswordsOpen] = useState<boolean>();
    const [addAssoOpen, setAddAssoOpen] = useState<boolean>();
    const [changeTopicOpen, setChangeTopicOpen] = useState<boolean>();

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
                            onClick={() => {setChangeTopicOpen(true)}}
                        >
                            Change
                        </Button>
                    </Paper>
                    <ChangeTopic open={changeTopicOpen as boolean} onClose={() => {setChangeTopicOpen(false)}} course={course} />
                    <Paper>
                        <Typography>
                            Add new association
                        </Typography>
                        <Button
                            color="primary"
                            onClick={() => {setAddAssoOpen(true)}}
                        >
                            Add
                        </Button>
                    </Paper>
                    <AddAsso open={addAssoOpen as boolean} onClose={() => {setAddAssoOpen(false)}} course={course}/>
                    <Paper>
                        <Typography>
                            Delete group
                        </Typography>
                        <Button
                            color="error"
                            onClick={() => {setConfirmPasswordsOpen(true)}}
                        >
                            Delete
                        </Button>
                    </Paper>
                    <ConfirmPasswords open={confirmPasswordsOpen as boolean} onClose={() => {setConfirmPasswordsOpen(false)}} course={course}/>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default AdminModal;