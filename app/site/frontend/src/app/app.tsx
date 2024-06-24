import Layout from "@modules/components/layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpForm from "./subapps/auth/sign_up.sbap";
import SignInForm from "./subapps/auth/sign_in.sbap";
import NewCourseForm from "./subapps/courses/new_course.sbap";
import ErrorPage from "@modules/components/error_page";
import ErrorFormatPage from "./subapps/error_format_page";
import MyCoursesPage from "./subapps/myfind_courses/my_courses.sbap";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><></></Layout>} index/>
                <Route path="/a/signup/" element={<SignUpForm />} />
                <Route path="/a/signin/" element={<SignInForm />} />
                <Route path="/c/new" element={<NewCourseForm />} />
                <Route path="/c/find" element={<SignInForm />} />
                <Route path="/c/my" element={<MyCoursesPage />} />
                <Route path="/c/:course_id" element={<SignInForm />} />
                
                <Route path="/error/:status_code/:detail" element={<ErrorFormatPage />} />
                <Route path="*" element={
                    <Layout>
                        <ErrorPage status_code={404} detail="Oops! Page Not Found" />
                    </Layout>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App;