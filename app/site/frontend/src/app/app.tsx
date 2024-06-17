import Layout from "@modules/components/layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><></></Layout>} index/>
                <Route path="/a/signin/" element={<Layout><></></Layout>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;