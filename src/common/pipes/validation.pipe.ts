import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
    Inject,
    Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { I18nService } from '../../i18n/i18n.service';

@Injectable({ scope: Scope.REQUEST })
export class CustomValidationPipe implements PipeTransform {
    constructor(
        private readonly i18nService: I18nService,
        @Inject(REQUEST) private readonly request: Request,
    ) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value;
        }

        const object = plainToInstance(metadata.metatype, value);
        const errors = await validate(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            const firstMessage = this.extractFirstError(errors);
            // Localize the message if it looks like a translation key
            const lang = this.i18nService.detectLanguage(this.request);
            const localizedMessage = firstMessage.startsWith('text_')
                ? this.i18nService.t(lang, firstMessage)
                : firstMessage;

            throw new BadRequestException({
                code: 0,
                message: localizedMessage,
            });
        }

        return object;
    }

    private toValidate(metatype: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private extractFirstError(errors: ValidationError[]): string {
        for (const error of errors) {
            if (error.constraints) {
                // Prefer required/IsNotEmpty errors
                if (error.constraints.isNotEmpty) {
                    return error.constraints.isNotEmpty as string;
                }
                // Otherwise, return the first constraint
                const messages = Object.values(error.constraints);
                if (messages.length > 0) {
                    return messages[0] as string;
                }
            }
            if (error.children && error.children.length > 0) {
                const nestedMessage = this.extractFirstError(error.children);
                if (nestedMessage) {
                    return nestedMessage;
                }
            }
        }
        return 'Validation failed';
    }
}
