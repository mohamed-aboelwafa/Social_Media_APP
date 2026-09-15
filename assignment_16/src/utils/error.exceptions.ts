
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
        super("validation error", {}, 409, validationErrors);
    }
}


// // use case:
// throw new NotFoundException("User not found");