import { Module } from '@nestjs/common';
import { ResponseUtil } from './utils/response.util';
import { I18nModule } from 'src/i18n/i18n.module';

@Module({
    imports: [I18nModule],
    providers: [ResponseUtil],
    exports: [ResponseUtil, I18nModule],
})
export class CommonModule { }
