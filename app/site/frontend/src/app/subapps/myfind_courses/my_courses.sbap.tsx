import Layout from "@modules/components/layout";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { loadMyCourses } from "@modules/reducers/slices/courses/my_courses/thunks/load_my_courses.thunk";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DoorBack } from "@mui/icons-material";
import { CourseEntity } from "@modules/reducers/slices/courses/const";

const MyCoursesPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { entities, error, loading, ids } = useAppSelector(
        (state) => state.my_courses
    );

    useEffect(() => {
        console.log(entities, error);
        
        const fetchCourses = async () => {
            if (
                !entities.length &&
                !error &&
                loading === LoadingStatus.ANotLoaded
            ) {
                await dispatch(loadMyCourses());
            }
            if (error) {
                navigate(
                    `/error/${(error as RejectedError).status_code}/${
                        (error as RejectedError).detail
                    }`
                );
            }
        };
        fetchCourses();
    }, [entities, error, loading, dispatch, navigate]);

    const renderContent = () => {
        if (loading === LoadingStatus.Loading) {
            return <CircularProgress />;
        }

        if (loading === LoadingStatus.Loaded && !ids.length) {
            return (
                <div>
                    <Typography variant="h6">
                        You don't have any courses yet, please search for
                        courses.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/c/find")}
                    >
                        Search Courses
                    </Button>
                </div>
            );
        }

        if (loading === LoadingStatus.Loaded) {
            return Object(entities).values.map((course: CourseEntity) => (
                <Accordion key={course.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="h3">{course.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{course.description}</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                navigate(`/course/${course.id}`);
                            }}
                        >
                            <DoorBack />
                            Go
                        </Button>
                        <Button>
    
                        </Button>
                    </AccordionDetails>
                </Accordion>
            ));
        }
    };

    return <Layout>{renderContent()}</Layout>;
};

export default MyCoursesPage;
