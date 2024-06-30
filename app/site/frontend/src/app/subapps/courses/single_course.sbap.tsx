import React, { useCallback, useEffect, useState } from "react";
import Layout from "@modules/components/layout";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { CourseEntity } from "@modules/reducers/slices/courses/const";
import { EntityId } from "@reduxjs/toolkit";
import { useParams, useNavigate } from "react-router-dom";
import { LaunchedAxios } from "@modules/api";
import PasswordForm from "./components/password_form";
import CourseRender from "./components/course_render";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { loadMyCourses } from "@modules/reducers/slices/courses/my_courses/thunks/load_my_courses.thunk";

const NotCourseRender: React.FC<{ course: CourseEntity | null; loadingCourse: boolean; error: string | null}> = ({ course, loadingCourse, error }) => {
    const navigate = useNavigate();
    if (loadingCourse) return <div>LoadingCourse...</div>;
    if (error) {
        navigate(`/error/500/${encodeURIComponent(error)}`);
        return null;
    }
    if (!course) {
        return (
            <div>
                <h1>Course not found</h1>
            </div>
        );
    }
    return (
        <div>
            {course.is_private ? (
                <PasswordForm id={course.id} error={error} />
            ) : (
                <CourseRender course={course} />
            )}
        </div>
    );
};

const SingleCourse: React.FC = () => {
    const dispatch = useAppDispatch();
    const { course_id } = useParams<{ course_id: string }>();
    const { ids, entities, loading } = useAppSelector(state => state.my_courses);
    const [course, setCourse] = useState<CourseEntity | null>(null);
    const [loadingCourse, setLoadingCourse] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadOneCourse = useCallback(async () => {
        try {
            const response = await LaunchedAxios.get(`/c/single/${course_id}`);
            setCourse(response.data.subdata as CourseEntity);
        } catch (err) {
            setError("Failed to load the course.");
        } finally {
            setLoadingCourse(false);
        }
    }, [course_id]);

    useEffect(() => {
        if (loading === LoadingStatus.ANotLoaded) {
            console.log("SingleCourse > if (loading === LoadingStatus.ANotLoaded) ");
            
            (async () => {
                await dispatch(loadMyCourses());
            })()
        }
        if (!ids.includes(course_id as EntityId)) {
            loadOneCourse();
        } else {
            setCourse(entities[course_id as EntityId] as CourseEntity);
            setLoadingCourse(false);
        }
    }, [course_id, ids, loadOneCourse, loading, entities, dispatch]);

    return (
        <Layout>
            {
                course_id && ids.includes(course_id as EntityId)
                    ? <CourseRender course={entities[course_id] as CourseEntity} />
                    : <NotCourseRender course={course} loadingCourse={loadingCourse} error={error} />
            }
        </Layout>
    );
};

export default SingleCourse;
