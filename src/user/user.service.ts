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

  async updateUser(user: any) {
    const { userId, email, ...fieldsToUpdate } = user; // email을 제외하거나 처리
    if (!userId) throw new Error('User ID is required for update'); // userId가 없으면 에러 발생
  
    try {
      // userId를 기반으로 업데이트
      await this.userRepository.update({ userId }, fieldsToUpdate);
  
      // 반환 없이 종료
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
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

  async signUpToGoogle(userId,email,username, dob,gender): Promise<User> {
    const foundUser = await this.getUser(email);
    if (foundUser) {
      return foundUser;
    }

    const newUser = await this.userRepository.save({
      userId,
      email,
      username,
      dob,
      gender
    })
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
