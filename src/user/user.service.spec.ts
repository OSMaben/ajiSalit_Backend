import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should register a new user', async () => {
    mockUserModel.findOne.mockReturnValue(null);
    mockUserModel.create.mockResolvedValue({
      id: 'user-id',
      phoneNumber: '123456789',
      password: 'hashed-password',
    });

    const result = await service.register({
      phoneNumber: '123456789',
      password: 'plain-password',
      role: 'user',
    });

    expect(result).toEqual({
      id: 'user-id',
      phoneNumber: '123456789',
      password: 'hashed-password',
    });
  });

  it('should throw an error if the phoneNumber number already exists', async () => {
    mockUserModel.findOne.mockResolvedValue({ id: 'user-id', phoneNumber: '123456789' });

    await expect(
      service.register({
        phoneNumber: '123456789',
        password: 'plain-password',
        role: 'user',
      }),
    ).rejects.toThrow('PhoneNumber number already registered');
  });
});
