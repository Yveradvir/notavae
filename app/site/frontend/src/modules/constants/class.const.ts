import { TableMixin } from "./mixins.const";

export interface Class extends TableMixin {
    name: string;
    description: string;
    image: string;
}