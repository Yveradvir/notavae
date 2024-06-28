import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Field, Form, Formik } from "formik";
import { FiltersEntity } from "@modules/reducers/slices/courses/const";
import { FiltersValuesSchema } from "./validation/filter.vd";

interface FilterFormProps {
    initialValues: FiltersEntity;
    onFormSubmit: (values: FiltersEntity) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ initialValues, onFormSubmit }) => {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onFormSubmit}
            validationSchema={FiltersValuesSchema}
        >
            {({ errors, touched, setFieldValue, values }) => (
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
                                        value={values.am_i_author}
                                        onChange={(event) => setFieldValue("am_i_author", parseInt(event.target.value))}
                                    >
                                        <FormControlLabel value={0} control={<Radio />} label="Yes, I'm the author" />
                                        <FormControlLabel value={1} control={<Radio />} label="All courses" />
                                        <FormControlLabel value={2} control={<Radio />} label="Exclude where I'm not the author" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            <Box mt={2}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={values.newest}
                                            onChange={(event) => setFieldValue("newest", event.target.checked)}
                                        />
                                    }
                                    label="Newest"
                                />
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
    );
};

export default FilterForm;
