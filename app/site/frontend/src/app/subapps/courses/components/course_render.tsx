import { useAppDispatch } from "@modules/reducers";
import { CourseEntity } from "@modules/reducers/slices/courses/const";
import { leaveCourse } from "@modules/reducers/slices/courses/my_courses/thunks/leave_course.thunk";
import { Box, Button, Paper, Typography } from "@mui/material";

interface CourseRenderProps {
    course: CourseEntity;
}

const CourseRender: React.FC<CourseRenderProps> = ({ course }) => {
    const dispatch = useAppDispatch();
    
    return (
        <Box>
            <Paper>
                <Typography>
                    {course.name}
                </Typography>
                <Typography>
                    {course.description}
                </Typography>
            </Paper>
            <Paper>

            </Paper>
            <Paper>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {await dispatch(leaveCourse(course.id))}}
                >
                    Submit
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {await dispatch(leaveCourse(course.id))}}
                >
                    Submit
                </Button>
            </Paper>
        </Box>

    );
};

export default CourseRender;