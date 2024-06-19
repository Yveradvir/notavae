export interface RejectedError {
    status_code: number;
    detail: string;
}

export type WrongData = {
    detail?: string;
}
