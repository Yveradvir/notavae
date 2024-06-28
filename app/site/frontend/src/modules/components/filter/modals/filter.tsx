import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useAppDispatch } from "@modules/reducers";
import { FiltersEntity } from "@modules/reducers/slices/courses/const";
import { findCoursesActions } from "@modules/reducers/slices/courses/find_courses";
import { myCoursesActions } from "@modules/reducers/slices/courses/my_courses";
import FilterForm from "./form"

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
                <FilterForm initialValues={initialValues} onFormSubmit={onFormSubmit} />
            </DialogContent>
        </Dialog>
    );
};

export default FilterModal;
