import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { CourseEntity } from "@modules/reducers/slices/courses/const";
import { leaveCourse } from "@modules/reducers/slices/courses/my_courses/thunks/leave_course.thunk";
import { joinToCourse } from "@modules/reducers/slices/courses/my_courses/thunks/join_to_course.thunk";
import {
    Box,
    Button,
    Paper,
    Typography,
    SpeedDial,
    SpeedDialAction,
    Grid,
    Avatar,
} from "@mui/material";
import { kickCcMember } from "@modules/reducers/slices/cc_memberships/thunks/kick_cc_member.thunk";
import { loadCcMemberships } from "@modules/reducers/slices/cc_memberships/thunks/load_cc_memberships.thunk";
import AdminModal from "./modals/admin";
import { AdminPanelSettingsOutlined, ExitToAppOutlined, PersonAddAltOutlined } from "@mui/icons-material";
import { MembershipEntity } from "@modules/reducers/slices/cc_memberships/const";
import StatusModal from "./modals/status.modal";
import { changeActivityCc } from "@modules/reducers/slices/cc_memberships/thunks/change_activity.thunk";

interface CourseRenderProps {
    course: CourseEntity;
}

const CourseRender: React.FC<CourseRenderProps> = ({ course }) => {
    const dispatch = useAppDispatch();
    const ccMemberships = useAppSelector((state) => state.current_course_memberships);
    const profile = useAppSelector((state) => state.profile);
    const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
    const [speedDialOpen, setSpeedDialOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(loadCcMemberships(course.id));
    }, [dispatch, course.id]);

    const handleLeaveCourse = async () => {
        await dispatch(leaveCourse(course.id));
    };

    const handleJoinCourse = async () => {
        await dispatch(joinToCourse({ course_id: course.id, password: null }));
    };

    const handleKickMember = async (user_id: string) => {
        await dispatch(kickCcMember({ course_id: course.id, kicked_id: user_id }));
    };

    const isAdmin = profile.instances.profileEntity?.id === course.author_id;
    const isMine = (membership: MembershipEntity) =>
        profile.instances.profileEntity?.id === membership.user_id;

    const isUserIn = () => {
        const user_ids = ccMemberships.ids.map((id) => ccMemberships.entities[id]?.user_id);
        return user_ids.includes(profile.instances.profileEntity?.id as string);
    };

    const membershipStatusIcon = (is_active: boolean) => (
        <Box
            component="span"
            sx={{
                display: "inline-block",
                width: 12,
                height: 12,
                bgcolor: is_active ? "green" : "red",
                borderRadius: "50%",
            }}
        />
    );

    return (
        <Box sx={{ padding: 2 }}>
            <Paper sx={{ marginBottom: 2, padding: 2 }}>
                <Typography variant="h5">{course.name}</Typography>
                <Typography>{course.description}</Typography>
            </Paper>
            <Paper sx={{ marginBottom: 2, padding: 2 }}>
                <Typography variant="h6">Memberships</Typography>
                {ccMemberships.ids.map((m_id) => {
                    const membership = ccMemberships.entities[m_id] as MembershipEntity;
                    return (
                        <Paper
                            key={membership.user_id}
                            sx={{
                                marginTop: 1,
                                padding: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    {membershipStatusIcon(membership.is_active)}
                                </Grid>
                                <Grid item>
                                    <Avatar 
                                        alt={membership.user_id}
                                        src={`data:image/jpeg;base64,${membership.image}` || "https://static-00.iconduck.com/assets.00/user-avatar-1-icon-511x512-ynet6qk9.png"}
                                    />
                                    <Typography variant="body1">{membership.username}</Typography>
                                </Grid>
                                <Grid item xs>
                                    <StatusModal
                                        isMine={isMine(membership)}
                                        status={membership.status}
                                        course_id={membership.course_id}
                                    />
                                </Grid>
                                {isMine(membership) && (
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={async () => {
                                                await dispatch(changeActivityCc(membership.course_id))
                                            }}
                                        >
                                            Switch activity
                                        </Button>
                                    </Grid>
                                )}
                                {isAdmin && !isMine(membership) && (
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleKickMember(membership.user_id)}
                                            startIcon={<ExitToAppOutlined />}
                                        >
                                            Kick
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    );
                })}
            </Paper>
            <Paper sx={{ marginBottom: 2, padding: 2 }}>
                <Typography variant="h6">Associations</Typography>
            </Paper>
            <SpeedDial
                ariaLabel="SpeedDial"
                open={speedDialOpen}
                onClose={() => setSpeedDialOpen(false)}
                onOpen={() => setSpeedDialOpen(true)}
                color="primary"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
            >
                <SpeedDialAction
                    icon={isUserIn() ? <ExitToAppOutlined /> : <PersonAddAltOutlined />}
                    tooltipTitle={isUserIn() ? "Leave" : "Join"}
                    onClick={isUserIn() ? handleLeaveCourse : handleJoinCourse}
                />
                {isAdmin && (
                    <SpeedDialAction 
                        icon={<AdminPanelSettingsOutlined/>}
                        tooltipTitle={"Admin panel"}
                        onClick={() => {setAdminModalOpen(true)}}
                    />
                )}
            </SpeedDial>
            {isAdmin && (
                <AdminModal
                    open={adminModalOpen}
                    onClose={() => setAdminModalOpen(false)}
                    course={course}
                />
            )}
        </Box>
    );
};

export default CourseRender;
