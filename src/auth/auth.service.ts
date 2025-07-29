import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async signup(email: string, password: string, name: string) {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException('text_user_already_exists');

    const hash = await bcrypt.hash(password, 10);

    const userDoc = new this.userModel({ email, password: hash, name });
    const user = await userDoc.save();

    const payload = { user_id: user._id, email: user.email }
    const token = this.jwtService.sign(payload);

    const userObj = user.toObject();
    const { password: _, __v, ...cleanUser } = userObj;

    const userDetails = {
      ...cleanUser,
      access_token: token
    };

    return userDetails;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).lean();
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('text_invalid_email');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException("text_invalid_password")
    }

    const payload = { user_id: user._id, email: user.email }
    const token = this.jwtService.sign(payload);

    const userDetails = {
      ...user,
      access_token: token
    }
    return userDetails;
  }
}
