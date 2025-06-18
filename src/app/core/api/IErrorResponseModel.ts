/**
 * Error response Model
 */
export interface IErrorResponseModel {
    /**
     * Error Code
     */
    code: string | null;

    /**
     * Error message
     */
    message: string | null;

    /**
     * Error details
     */
    details: string | null;

    /**
     * Timestamp
     */
    timeStamp: string;
}