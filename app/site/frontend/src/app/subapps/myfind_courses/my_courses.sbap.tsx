import Layout from "@modules/components/layout";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { loadMyCourses } from "@modules/reducers/slices/courses/my_courses/thunks/load_my_courses.thunk";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import { myCoursesActions } from "@modules/reducers/slices/courses/my_courses";
import FilterButton from "@modules/components/filter";
import CourseAccordion from "./components/course_accordion";
import { EntityId } from "@reduxjs/toolkit";

const MyCoursesPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loadings } = useAppSelector((state) => state.profile);
    const { entities, error, loading, ids } = useAppSelector(
        (state) => state.my_courses
    );

    const onSubmit = useCallback(async () => {
        if (loadings.profileEntity === LoadingStatus.Loaded) {
            await dispatch(loadMyCourses());
        }
    }, [loadings, dispatch]);

    useEffect(() => {
        const fetchCourses = async () => {
            onSubmit();
            if (error) {
                navigate(
                    `/error/${(error as RejectedError).status_code}/${
                        (error as RejectedError).detail
                    }`
                );
            }
        };
        fetchCourses();
    }, [dispatch, error, navigate, onSubmit]);

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
                    <CourseAccordion course={entities[id]} />
                ));
            }
        }

        return null;
    };

    return (
        <Layout>
            <Box>
                <FilterButton onSubmit={onSubmit} actions={myCoursesActions} />
            </Box>
            {renderContent()}
        </Layout>
    );
};

export default MyCoursesPage;
