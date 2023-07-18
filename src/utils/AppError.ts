export class AppError extends Error {
    statusCode: number
    errorCode: number
    constructor(message: string, statusCode: number, errorCode: number) {
        super(message)
        this.statusCode = statusCode
        this.errorCode = errorCode
    }
}

