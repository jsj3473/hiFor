import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createUser(user): Promise<User> {
    return this.userRepository.save(user);
  }

  async isUserId(userId: string) {
    const result = await this.userRepository.findOne({
      where: { userId },
    });
    console.log(result);
    return result;

  }  
  
  async isEmail(email: string) {
    const result = await this.userRepository.findOne({
      where: { email },
    });
    console.log(result);
    return result;

  }

  async getUser(userId: string) {
    const result = await this.userRepository.findOne({
      where: { userId },
    });
    return result;
  }

  // username과 password만 변경 가능
  updateUser(user) {
    return this.userRepository.save(user); // await를 추가하여 저장 과정이 완료되기를 기다림
  }

  deleteUser(email: any) {
    return this.userRepository.delete({ email });
  }

  updatePassword(userId: string, newPassword: string) {
    return this.userRepository.save({ userId, newPassword });
  }

  async findByEmailOrSave(email,userId, username, password, providerId): Promise<User> {
    const foundUser = await this.getUser(email);
    if (foundUser) {
      return foundUser;
    }

    const newUser = await this.userRepository.save({
      email,
      userId,
      username,
      password,
      providerId,
    });
    return newUser;
  }
}
