import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './model/user.model';
import { UserEntity } from '../users/entity/user.entity';
import { toUserModel } from '../shared/mapper';
import { CreateUserModel } from './model/createUser.model';
import { LoginModel } from './model/login.model';
import { comparePasswords } from '../shared/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findOne(options?: object): Promise<UserModel> {
    const user = await this.userRepo.findOne(options);
    return toUserModel(user);
  }

  async findByLogin({ username, password }: LoginModel): Promise<UserModel> {
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserModel(user);
  }

  async findByPayload({ username }: any): Promise<UserModel> {
    return await this.findOne({ where: { username } });
  }

  async create(userModel: CreateUserModel): Promise<UserModel> {
    const { username, password, email } = userModel;

    // check if the user exists in the db
    const userInDb = await this.userRepo.findOne({ where: { username } });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await this.userRepo.create({
      username,
      password,
      email,
    });

    await this.userRepo.save(user);

    return toUserModel(user);
  }

  private _sanitizeUser(user: UserEntity) {
    delete user.password;
    return user;
  }
}
