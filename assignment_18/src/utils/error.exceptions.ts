
import z from "zod";

export interface IError extends Error {
    statusCode: number
    validationError?: z.core.$ZodIssue[]
}

abstract class AppError extends Error {
    constructor(
        message: string,
        options: ErrorOptions = {},
        public statusCode: number,
        public validationError?: z.core.$ZodIssue[]
    ) {
        super(message, options);
    }
}

export class NotFoundException extends AppError {
    constructor(
        message = "Not Found",
        options: ErrorOptions = {}
    ) {
        super(message, options, 404);
    }
}

export class BadRequestException extends AppError {
    constructor(
        message = "Bad Request",
        options: ErrorOptions = {}
    ) {
        super(message, options, 400);
    }
}

export class ValidationException extends AppError {
    constructor(
        validationErrors: z.core.$ZodIssue[]
    ) {
        super("validation error", {}, 400, validationErrors);
    }
}



export class UnAuthorizedException extends AppError {
    constructor(message = "UnAuthorized",options: ErrorOptions = {}) {
        super(message, options, 401);
    }
}
