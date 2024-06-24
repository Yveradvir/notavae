import { TableMixin } from "@modules/constants/mixins.const";

export interface CourseEntity extends TableMixin {
    name: string;
    image: string | null;
    description: string;
    author_id: string;
}

export interface FiltersEntity {
    name: string | null;
    newest: boolean;
    am_i_author: boolean;
}

export const defaultFilters: FiltersEntity = {
    name: null,
    newest: true,
    am_i_author: false
}