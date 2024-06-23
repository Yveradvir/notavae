import { TableMixin } from "@modules/constants/mixins.const";

export interface CourseEntity extends TableMixin {
    name: string;
    image: string;
    description: string;
    author_id: string;
}

export interface FiltersEntity {
    name: string | null;
    newest: boolean;
}

export const defaultFilters: FiltersEntity = {
    name: null,
    newest: true
}