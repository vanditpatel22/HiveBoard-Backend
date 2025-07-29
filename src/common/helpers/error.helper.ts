import { Request, Response } from 'express';
import { logger } from 'src/common/utils/logger.util'; // your logger import
import { ResponseUtil } from 'src/common/utils/response.util';
import { RESPONSE_CODE, STATUS } from '../constants/response-codes.constant';


/**
 * Handles exceptions by logging and sending formatted error response
 * 
 * @param req Express Request object
 * @param res Express Response object
 * @param error The caught error object
 * @param responseUtil Instance of ResponseUtil to send response
 * @param defaultStatus Optional default status code (default 500)
 * @param defaultMessage Optional default keyword/message (default 'text_internal_error')
 */

export function handleControllerError(
    req: Request,
    res: Response,
    error: any,
    responseUtil: ResponseUtil,
    defaultStatus: number = STATUS.INTERNAL_SERVER_ERROR,
    defaultMessage: string = 'text_internal_error'
) {
    
    console.error(error);
    logger.error(`${req.method} ${req.originalUrl} :: ${error.message}`);

    const responseMessage =
        typeof error.message === 'string' && error.message.trim() !== ''
            ? error.message
            : defaultMessage;

    const responseStatusCode = error?.status || defaultStatus;

    return responseUtil.sendResponse(
        req,
        res,
        responseStatusCode,
        RESPONSE_CODE.FAIL,
        {
            keyword: responseMessage,
            components: { error: error?.message || null },
        },
        null
    );
}
