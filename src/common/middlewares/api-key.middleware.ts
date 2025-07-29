import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { ResponseUtil } from '../utils/response.util';
import { RESPONSE_CODE, STATUS } from '../constants/response-codes.constant';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
        private readonly responseUtil: ResponseUtil
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        const apiKey = req.headers['x-api-key'];
        const validApiKey = this.configService.get<string>('API_KEY');

        if (!apiKey || apiKey !== validApiKey) {
            return this.responseUtil.sendResponse(
                req,
                res,
                STATUS.UNAUTHORIZED,
                RESPONSE_CODE.UNAUTHORIZED_ACCESS,
                {
                    keyword: 'text_invalid_api_key',
                    components: {},
                },
                null
            );
        }

        next();
    }
}
