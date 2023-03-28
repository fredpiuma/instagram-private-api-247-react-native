import { IgResponseError } from './ig-response.error';
import { CheckpointResponse } from '../responses';
export declare class IgCheckpointError extends IgResponseError<CheckpointResponse> {
    get url(): any;
    get apiUrl(): string;
}
