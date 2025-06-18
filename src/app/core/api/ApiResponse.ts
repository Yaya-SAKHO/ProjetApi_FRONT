import { IErrorResponseModel } from "./IErrorResponseModel";


/**
 * Api response model
 */
export class ApiResponse<T> {

    /**
     * Sucess
     */
    Success: boolean;

    /**
     * Api response (null if success false)
     */
    Data: T | null;

    /**
     * Error content
     */
    Error: IErrorResponseModel | null;

    /**
     * Status
     */
    Status: number;

    /**
     * Constructor
     * @param success 
     * @param data 
     * @param error 
     */
    constructor(success: boolean, data: T | null, error: IErrorResponseModel | null, status : number) {
        this.Success = success;
        this.Data = data;
        this.Error = error;
        this.Status = status;
    }
}