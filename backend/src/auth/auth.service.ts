import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { LogInDto } from './dto/logIn.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ status: string }> {
    const {
      first_name,
      last_name,
      email_address,
      password,
      contact_number,
      address,
      birthday,
      civil_status,
      user_type,
      isAuthenticated,
      membership_date,
      fishing_vessel_type,
      person_to_notify,
    } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await this.userModel.create({
        first_name,
        last_name,
        email_address,
        password: hashedPassword,
        contact_number,
        address,
        birthday,
        civil_status,
        user_type,
        isAuthenticated,
        membership_date,
        person_to_notify,
        fishing_vessel_type,
    })


    // const token = this.jwtService.sign({ id: user._id });

    if (user._id) {
        return { status: 'success' };
      } else {
        return { status: 'failed' };
      }
  }


  async login(loginDto: LogInDto, response: Response): Promise <{token: string}>{
    const {email_address, password} = loginDto;

    const user = await this.userModel.findOne({email_address})

    if(!user){
        throw new UnauthorizedException('No Account Found!');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        throw new UnauthorizedException('Wrong Password!');
    }

    const token = this.jwtService.sign({ id: user._id });

    response.cookie('token', token, {httpOnly: true, maxAge: -1, path: "/", domain: "localhost:3001"});
0
    return { token : token };
  }
}
