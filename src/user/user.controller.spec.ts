import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    register: jest.fn(),
    verifyOTP: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      phoneNumber: '+212697042868',
      password: 'password123',
      role: 'client',
    };

    it('should register a new user and send OTP', async () => {
      const expectedResponse = {
        message: 'OTP sent successfully',
        userId: 'mocked-user-id',
      };

      mockUserService.register.mockResolvedValue(expectedResponse);

      const result = await userController.register(createUserDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUserService.register).toHaveBeenCalledWith(createUserDto);
      expect(mockUserService.register).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if phone number is already registered', async () => {
      mockUserService.register.mockRejectedValue(
        new BadRequestException('Phone number already registered')
      );

      await expect(userController.register(createUserDto))
        .rejects
        .toThrow(BadRequestException);
      
      expect(mockUserService.register).toHaveBeenCalledWith(createUserDto);
      expect(mockUserService.register).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if registration fails', async () => {
      mockUserService.register.mockRejectedValue(
        new BadRequestException('Registration failed')
      );

      await expect(userController.register(createUserDto))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('verifyOTP', () => {
    const phoneNumber = '+212697042868';
    const otp = '123456';

    it('should verify OTP successfully', async () => {
      const expectedResponse = { 
        message: 'Phone number verified successfully' 
      };

      mockUserService.verifyOTP.mockResolvedValue(expectedResponse);

      const result = await userController.verifyOTP(phoneNumber, otp);

      expect(result).toEqual(expectedResponse);
      expect(mockUserService.verifyOTP).toHaveBeenCalledWith(phoneNumber, otp);
      expect(mockUserService.verifyOTP).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if OTP is invalid', async () => {
      mockUserService.verifyOTP.mockRejectedValue(
        new BadRequestException('Invalid OTP')
      );

      await expect(userController.verifyOTP(phoneNumber, otp))
        .rejects
        .toThrow(BadRequestException);
      
      expect(mockUserService.verifyOTP).toHaveBeenCalledWith(phoneNumber, otp);
    });

    it('should throw BadRequestException if OTP is expired', async () => {
      mockUserService.verifyOTP.mockRejectedValue(
        new BadRequestException('OTP expired')
      );

      await expect(userController.verifyOTP(phoneNumber, otp))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    const loginUserDto: LoginUserDto = {
      phoneNumber: '+212697042868',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      const expectedResponse = {
        message: 'Login successful',
        token: 'mocked-jwt-token',
        User: { 
          phoneNumber: loginUserDto.phoneNumber,
          role: 'client',
          isVerified: true 
        },
      };

      mockUserService.login.mockResolvedValue(expectedResponse);

      const result = await userController.login(loginUserDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUserService.login).toHaveBeenCalledWith(loginUserDto);
      expect(mockUserService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      mockUserService.login.mockRejectedValue(
        new BadRequestException('This User Does not exists')
      );

      await expect(userController.login(loginUserDto))
        .rejects
        .toThrow(BadRequestException);
      
      expect(mockUserService.login).toHaveBeenCalledWith(loginUserDto);
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      mockUserService.login.mockRejectedValue(
        new BadRequestException('Password incorrect')
      );

      await expect(userController.login(loginUserDto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException if phone number is not verified', async () => {
      mockUserService.login.mockRejectedValue(
        new BadRequestException('Phone number not verified')
      );

      await expect(userController.login(loginUserDto))
        .rejects
        .toThrow(BadRequestException);
    });
  });
});