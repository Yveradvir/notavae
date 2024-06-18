import Layout from "@modules/components/layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpForm from "./subapps/auth/sign_up.sbap";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><></></Layout>} index/>
                <Route path="/a/signup/" element={<SignUpForm />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;