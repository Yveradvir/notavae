import Layout from "@modules/components/layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpForm from "./subapps/auth/sign_up.sbap";
import SignInForm from "./subapps/auth/sign_in.sbap";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><></></Layout>} index/>
                <Route path="/a/signup/" element={<SignUpForm />} />
                <Route path="/a/signin/" element={<SignInForm />} />
                <Route path="/c/new" element={<SignInForm />} />
                <Route path="/c/find" element={<SignInForm />} />
                <Route path="/c/my" element={<SignInForm />} />
                <Route path="/c/:course_id" element={<SignInForm />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;