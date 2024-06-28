import { CourseEntity } from "@modules/reducers/slices/courses/const";
import { Accordion, AccordionDetails, AccordionSummary, Button, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DoorBack } from "@mui/icons-material";

const CourseAccordion: React.FC<{ course: CourseEntity }> = ({ course }) => {
    const navigate = useNavigate();

    return (
        <Accordion key={course.id}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography variant="h3">{course.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {course.image && (
                    <CardMedia
                        component="img"
                        height="140"
                        image={`data:image/jpeg;base64,${course.image}`}
                        alt={course.name}
                        className="post-image"
                    />
                )}
                <Typography>{course.description}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        navigate(`/c/${course.id}`);
                    }}
                >
                    <DoorBack />
                    Go
                </Button>
            </AccordionDetails>
        </Accordion>
    );
};

export default CourseAccordion;
