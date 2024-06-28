import Layout from "@modules/components/layout";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";
import { EntityId } from "@reduxjs/toolkit";
import { loadFindCourses } from "@modules/reducers/slices/courses/find_courses/thunks/load_find_courses.thunk";
import InfiniteScroll from "react-infinite-scroll-component";
import FilterButton from "@modules/components/filter";
import { findCoursesActions } from "@modules/reducers/slices/courses/find_courses";
import CourseAccordion from "./components/course_accordion";

const FindCoursesPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(1);

    const { entities, loading, ids, hasMore } = useAppSelector(
        (state) => state.find_courses
    );

    useEffect(() => {
        const fetchCourses = async () => {
            const result = await dispatch(loadFindCourses(page));
            if (loadFindCourses.rejected.match(result) && result.payload) {
                navigate(
                    `/error/${(result.payload as RejectedError).status_code}/${
                        (result.payload as RejectedError).detail
                    }`
                );
            }
        };

        fetchCourses();
    }, [dispatch, navigate, page]);

    const loadMore = useCallback(async () => {
        setPage((prevPage) => prevPage + 1);
        await dispatch(loadFindCourses(page));
    }, [setPage, page, dispatch]);

    const renderContent = () => {
        if (loading === LoadingStatus.Loading && page === 1) {
            return (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            );
        }

        if (loading === LoadingStatus.Loaded && ids.length === 0) {
            return (
                <Box mt={2}>
                    <Typography variant="h6">
                        There's no courses by your query.
                    </Typography>
                </Box>
            );
        }

        return (
            <InfiniteScroll
                dataLength={ids.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                    <Box display="flex" justifyContent="center" mt={2}>
                        <CircularProgress />
                    </Box>
                }
                endMessage={
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Typography variant="h6">
                            You have seen it all!
                        </Typography>
                    </Box>
                }
            >
                {ids.map((id: EntityId) => (
                    <CourseAccordion course={entities[id]}/>
                ))}
            </InfiniteScroll>
        );
    };

    const onSubmit = useCallback(async () => {
        setPage(1);
        await dispatch(loadFindCourses(page));
    }, [setPage, page, dispatch]);

    return (
        <Layout>
            <Box>
                <FilterButton onSubmit={onSubmit} actions={findCoursesActions} />
            </Box>
            {renderContent()}
        </Layout>
    );
};

export default FindCoursesPage;
