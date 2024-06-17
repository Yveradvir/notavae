import { TableMixin } from "./mixins.const";

export interface User extends TableMixin {
    username: string;
    email: string;
    birth: string;
}
