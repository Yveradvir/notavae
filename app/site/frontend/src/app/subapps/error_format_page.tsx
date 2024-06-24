import ErrorPage from "@modules/components/error_page";
import Layout from "@modules/components/layout";
import { useParams } from "react-router-dom";

const ErrorFormatPage = () => {
    const { status_code, detail } = useParams();

    return (
        <Layout>
            <ErrorPage
                status_code={status_code ? Number.parseInt(status_code) : 500}
                detail={detail ? detail : "Something went wrong"}
            />
        </Layout>
    );
};

export default ErrorFormatPage;
