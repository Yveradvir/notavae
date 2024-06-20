import { TableMixin } from "@modules/constants/mixins.const";
import { LoadingStatus } from "@modules/constants/reducers.conts"
import { RejectedError } from "@modules/constants/rejector.const";

export interface ProfileEntity extends TableMixin {
    username: string;
    email: string;
    birth: string;
}

export interface ProfileState {
    instances: {
        profileEntity: ProfileEntity | null;
        profileImage: string | null;
    }
    loadings: {
        profileEntity: LoadingStatus;
        profileImage: LoadingStatus;
    },
    errors: {
        profileEntity: RejectedError | null;
        profileImage: RejectedError | null;
    }
}

export const profileInitialState = {
    instances: {
        profileEntity: null,
        profileImage: null,
    },
    loadings: {
        profileEntity: LoadingStatus.ANotLoaded,
        profileImage: LoadingStatus.ANotLoaded,
    },
    errors: {
        profileEntity: null,
        profileImage: null,
    },
} 