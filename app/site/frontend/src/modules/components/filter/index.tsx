import { Filter1Outlined } from "@mui/icons-material";
import { SwitchChip } from "../header/components";
import { myCoursesActions } from "@modules/reducers/slices/courses/my_courses";
import { findCoursesActions } from "@modules/reducers/slices/courses/find_courses";
import { useState } from "react";
import FilterModal from "./modals/filter";

interface FilterButtonI {
    actions: typeof findCoursesActions | typeof myCoursesActions
    onSubmit: () => void
}

const FilterButton: React.FC<FilterButtonI> = ({actions, onSubmit}) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <SwitchChip
                label="Filter"
                icon={<Filter1Outlined />}
                onClick={() => {setOpen(true)}}
                color="info"
            />
            <FilterModal open={open} actions={actions} onClose={() => {setOpen(false)}} onSubmit={onSubmit}/>
        </div>
    );
}

export default FilterButton;