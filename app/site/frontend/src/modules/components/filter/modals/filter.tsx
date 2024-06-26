import { FiltersEntity } from "@modules/reducers/slices/courses/const";
import { findCoursesActions } from "@modules/reducers/slices/courses/find_courses";
import { myCoursesActions } from "@modules/reducers/slices/courses/my_courses";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useAppDispatch } from "@modules/reducers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FiltersValuesSchema } from "./validation/filter.vd";

interface FilterModalI {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    actions: typeof findCoursesActions | typeof myCoursesActions;
}

const FilterModal: React.FC<FilterModalI> = ({ open, actions, onClose, onSubmit }) => {
    const dispatch = useAppDispatch();
    const initialValues: FiltersEntity = {
        am_i_author: 1,
        name: null,
        newest: true,
    };

    const onFormSubmit = (values: FiltersEntity) => {
        dispatch(actions.changeNewFilter(values));
        onSubmit();
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
                    validationSchema={FiltersValuesSchema}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <Form>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography variant="h3">Filters</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box mt={2}>
                                        <Field
                                            as={TextField}
                                            name="name"
                                            label="Filter by name"
                                            type="text"
                                            variant="outlined"
                                            fullWidth
                                            error={touched.name && !!errors.name}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Box>
                                    <Box mt={2}>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                name="am_i_author"
                                                value={initialValues.am_i_author}
                                                onChange={(event) => setFieldValue("am_i_author", parseInt(event.target.value))}
                                            >
                                                <FormControlLabel value={0} control={<Radio />} label="Yes, I'm the author" />
                                                <FormControlLabel value={1} control={<Radio />} label="All courses" />
                                                <FormControlLabel value={2} control={<Radio />} label="Exclude where I'm not the author" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            <Box mt={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Apply Filters
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default FilterModal;
