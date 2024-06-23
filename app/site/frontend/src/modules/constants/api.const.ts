export enum ResponseModelTypes {
    default = 1,
    noneresulted
}

export interface TodoModel {
    user_profile_update: boolean;
    user_profile_unset: boolean;
    my_courses_update: boolean;
    my_courses_unset: boolean;
}