import { Request, Response } from 'express';
import { I18nService } from '../../i18n/i18n.service';
import { Injectable } from '@nestjs/common';
import { logger } from './logger.util';

export interface ResponseMessage {
    keyword: string;
    components?: Record<string, string | number>;
}

@Injectable()
export class ResponseUtil {
    constructor(private readonly i18n: I18nService) { }

    getMessage(lang: string, keyword: string, components?: Record<string, any>): string {
        try {
            return this.i18n.t(lang, keyword, components);
        } catch (error) {
            logger.error(`getMessage :: ${error.message}`);
            console.error(`getMessage :: ${error.message}`);
            return keyword;
        }
    }

    sendResponse(
        req: Request,
        res: Response,
        statusCode: number,
        responseCode: number | string,
        responseMessage: ResponseMessage,
        responseData: any = null,
    ): void {
        try {
            const lang = this.i18n.detectLanguage(req);

            const formedMsg = this.getMessage(
                lang,
                responseMessage.keyword,
                responseMessage.components
            );

            const resultObj: any = {
                code: responseCode,
                message: formedMsg,
            };

            if (responseData !== null) resultObj.data = responseData;

            res.status(statusCode).json(resultObj);
        } catch (error) {
            logger.error(error.message);
            console.error(error);
            res.status(statusCode).json({
                code: responseCode,
                message: 'An internal error occurred',
            });
        }
    }
}
