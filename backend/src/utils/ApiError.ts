export class ApiError extends Error {
    public statusCode: number;
    public success: boolean;
    public message: string;
    public errors: unknown[];
    public data: null;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: unknown[] = []
    ) {
        super(message);

        this.statusCode = statusCode;
        this.success = false
        this.message = message;
        this.errors = errors;
        this.data = null;

        Error.captureStackTrace(this, this.constructor);
    }
}
