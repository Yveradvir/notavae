import { RejectedError, WrongData } from "@modules/constants/rejector.const";
import { AxiosError } from "axios";

export class Rejector {        
    static standartReject(status_code: number = 500): RejectedError {
        return {
            status_code: status_code,
            detail: "Something went wrong..."
        }
    }

    static standartAxiosReject(error: AxiosError | unknown): RejectedError {
        if (error instanceof AxiosError) {
            if (error.response) {
                if (error.response.data) {
                    const data: WrongData = error.response.data;
                    if (typeof data.detail === 'string') {
                        return {
                            status_code: error.response.status,
                            detail: data.detail
                        }
                    }
                }
            }
            return this.standartReject(error.status)
        }

        return this.standartReject()
    }
}
