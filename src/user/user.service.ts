import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { https } from 'follow-redirects';
import { LoginUserDto } from './dto/Logindto/login-user.dto';



@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  private async sendSMS(phoneNumber: string, message: string) {
    return new Promise((resolve, reject) => {
      const options = {
        'method': 'POST',
        'hostname': 'jjw8n9.api.infobip.com',
        'path': '/sms/2/text/advanced',
        'headers': {
          'Authorization': 'App 24031eaf33336927b1fd3fae6c6d9788-70516893-7c9e-4f96-9870-fc6c2e8a3fcc',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        'maxRedirects': 20
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
        res.on('error', (error) => {
          reject(error);
        });
      });

      const postData = JSON.stringify({
        "messages": [
          {
            "destinations": [{ "to": phoneNumber.replace(/^\+/, '') }],
            "from": "Aji Salit",
            "text": message
          }
        ]
      });

      req.write(postData);
      req.end();
    });
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(createUserDto:CreateUserDto) {
    try {
      const { name, phoneNumber, role } = createUserDto;

      const existingUser = await this.userModel.findOne({ phoneNumber }).exec();
      if (existingUser) {
        throw new BadRequestException('Phone number already registered');
      }

      const otp = this.generateOTP();
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

      const newUser = new this.userModel({
        name,
        phoneNumber,
        role,
        isVerified: false,
        otp,
        otpExpiry
      });

      const savedUser = await newUser.save();

      try {
        await this.sendSMS(
          phoneNumber,
          `سلام هدا كود ديل ديال توتيق نمرة${otp} ، صالح غير ل-10 ديال دقايق حاول تخدم بيه ف أسرع وقت `
        );
      } catch (error) {
        await this.userModel.deleteOne({ _id: savedUser._id });
        throw new BadRequestException('Failed to send OTP');
      }

      return { 
        message: 'OTP sent successfully',
        userId: savedUser._id
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed');
    }
  }

  async verifyOTP(phoneNumber: string, otp: string) {
    const user = await this.userModel.findOne({ phoneNumber }).exec();
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > user.otpExpiry) {
      throw new BadRequestException('OTP expired');
    }

    // Update user verification status
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return { message: 'Phone number verified successfully' };
  }



  login(LoginUserDto:LoginUserDto):Promise<User>{
    return `This action returns all users`;

  }



  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
