import Layout from "@modules/components/layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpForm from "./subapps/auth/sign_up.sbap";
import SignInForm from "./subapps/auth/sign_in.sbap";
import NewCourseForm from "./subapps/courses/new_course.sbap";
import ErrorPage from "@modules/components/error_page";
import ErrorFormatPage from "./subapps/error_format_page";
import MyCoursesPage from "./subapps/myfind_courses/my_courses.sbap";
import cookies from "@modules/utils/cookies";
import { useAppDispatch } from "@modules/reducers";
import { loadMyProfile } from "@modules/reducers/slices/profile/thunks/load_my_profile.thunk";
import { loadMyProfileImage } from "@modules/reducers/slices/profile/thunks/load_my_pfp.thunk";
import FindCoursesPage from "./subapps/myfind_courses/find_courses.sbap";
import SingleCourse from "./subapps/courses/single_course.sbap";
import { loadMyCourses } from "@modules/reducers/slices/courses/my_courses/thunks/load_my_courses.thunk";

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    if (cookies.get("refresh_csrf")) {
        (async () => {
            await dispatch(loadMyProfile());
            await dispatch(loadMyCourses());
            dispatch(loadMyProfileImage());
        })();
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout>
                            <></>
                        </Layout>
                    }
                    index
                />
                <Route path="/a/signup/" element={<SignUpForm />} />
                <Route path="/a/signin/" element={<SignInForm />} />
                <Route path="/c/new" element={<NewCourseForm />} />
                <Route path="/c/find" element={<FindCoursesPage />} />
                <Route path="/c/my" element={<MyCoursesPage />} />
                <Route path="/c/:course_id" element={<SingleCourse />} />

                <Route
                    path="/error/:status_code/:detail"
                    element={<ErrorFormatPage />}
                />
                <Route
                    path="*"
                    element={
                        <Layout>
                            <ErrorPage
                                status_code={404}
                                detail="Oops! Page Not Found"
                            />
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
