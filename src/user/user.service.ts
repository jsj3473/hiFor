import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/user/user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

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
    //console.log(result);
    return result;

  }  
  
  async isEmail(email: string) {
    const result = await this.userRepository.findOne({
      where: { email },
    });
    //console.log(result);
    return result;

  }

  async getUser(userId: string) {
    const result = await this.userRepository.findOne({
      where: { userId },
    });
    //console.log(result)
    return result;
  }

  async findByEmail(email: string) {
    const result = await this.userRepository.findOne({
      where: { email },
    });
    return result;
  }

  // username과 password만 변경 가능
  updateUser(user) {
    return this.userRepository.save(user); // await를 추가하여 저장 과정이 완료되기를 기다림
  }

  async updateUserPassword(userId: string, password: string) {
    const user = await this.getUser(userId);
    user.password = password;
    user.passwordReset = false;
    return this.userRepository.save(user);
  }

  deleteUser(email: any) {
    return this.userRepository.delete({ email });
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

  async findByUsernameAndEmail(userId: string, email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { userId, email },
    });
  }

  // 비밀번호 업데이트 및 초기화 플래그 설정
  async updatePasswordAndFlag(userId: string, newPassword: string): Promise<void> {
    // 비밀번호 암호화
    const encryptedPassword = bcrypt.hashSync(newPassword, 10);

    // 1. 사용자 정보 가져오기
    const user = await this.getUser(userId);
    user.password = encryptedPassword;
    user.passwordReset = true;

    // 2. 사용자 정보 저장 (update 대신 save 사용)
    await this.userRepository.save(user);

    // 3. 업데이트된 사용자 정보 출력 (재조회)
    const updatedUser = await this.getUser(userId);
    
    console.log('Updated User:', updatedUser);
  }
}
