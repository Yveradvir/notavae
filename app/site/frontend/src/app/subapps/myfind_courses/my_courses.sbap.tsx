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
import { EntityId } from "@reduxjs/toolkit";

const MyCoursesPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loadings } = useAppSelector(state => state.profile)
    const { entities, error, loading, ids } = useAppSelector(
        (state) => state.my_courses
    );

    useEffect(() => {
        const fetchCourses = async () => {
            if (loadings.profileEntity === LoadingStatus.Loaded) {
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
    }, [dispatch, error, navigate, loadings]);

    const renderContent = () => {
        if (loading === LoadingStatus.Loading) {
            return <CircularProgress />;
        }

        if (loading === LoadingStatus.Loaded) {
            if (!ids.length) {
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

            if (entities) {
                return ids.map((id: EntityId) => (
                    <Accordion key={entities[id].id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography variant="h3">{entities[id].name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{entities[id].description}</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    navigate(`/c/${entities[id].id}`);
                                }}
                            >
                                <DoorBack />
                                Go
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                ));
            
            }
        }

        return null;
    };

    return <Layout>{renderContent()}</Layout>;
};

export default MyCoursesPage;
