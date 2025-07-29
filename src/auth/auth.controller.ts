import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseUtil } from 'src/common/utils/response.util';
import { handleControllerError } from 'src/common/helpers/error.helper';
import { STATUS, RESPONSE_CODE } from 'src/common/constants/response-codes.constant';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseUtil: ResponseUtil
  ) { }

  @Post('signup')
  async signup(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SignupDto) {

    try {
      const user = await this.authService.signup(body.email, body.password, body.name);

      if (user != null) {

        return this.responseUtil.sendResponse(
          req,
          res,
          STATUS.CREATED,
          RESPONSE_CODE.SUCCESS,
          { keyword: 'text_user_signup_succ', components: {} },
          user
        );

      } else {
        return this.responseUtil.sendResponse(
          req,
          res,
          STATUS.BAD_REQUEST,
          RESPONSE_CODE.USER_ALREADY_EXISTS,
          { keyword: 'text_user_signup_fail', components: {} },
          null
        );
      }

    } catch (error) {
      return handleControllerError(req, res, error, this.responseUtil);
    }

  }

  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LoginDto) {

    try {
      const loginDetails = await this.authService.login(body.email, body.password);

      if (loginDetails != null) {

        return this.responseUtil.sendResponse(
          req,
          res,
          STATUS.OK,
          RESPONSE_CODE.SUCCESS,
          { keyword: 'text_user_login_succ', components: {} },
          loginDetails
        );

      } else {

        return this.responseUtil.sendResponse(
          req,
          res,
          STATUS.BAD_REQUEST,
          RESPONSE_CODE.INVALID_EMAIL,
          { keyword: 'text_user_login_fail', components: {} },
          null
        );

      }
    } catch (error) {
      return handleControllerError(req, res, error, this.responseUtil);
    }

  }
}

