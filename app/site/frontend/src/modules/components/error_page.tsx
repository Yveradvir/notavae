import { RejectedError } from "@modules/constants/rejector.const";
import { Button } from "@mui/material";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC<RejectedError & { children?: ReactNode }> = ({
    detail,
    status_code,
    children
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                navigate(-1);
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [navigate]);

    return (
        <div className="text-center mt-5">
            <h1 className="display-1">{status_code}</h1>
            <h2 className="display-4">{detail}</h2>
            {children}
            <Button
                onClick={() => {
                    navigate(-1);
                }}
                variant="contained"
                color="primary"
            >
                Go back to previous
            </Button>
        </div>
    );
};

export default ErrorPage;
