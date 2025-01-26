import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import axios from 'axios';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google',
      scope: [
        'email',
        'profile'
      ],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;
    const email = emails?.[0]?.value;

    if (!email) {
      throw new Error('Email is required but not provided by Google.');
    }

    try {
      const fullName = `${name?.familyName || ''} ${name?.givenName || ''}`.trim();

      // Check if user already exists
      let user: User;
      try {
        user = await this.userService.findByEmail(email);
        console.log(user)
      } catch (error) {
        console.error(`Error finding user by email (${email}):`, error);
        throw new Error('Failed to find user by email');
      }

      if (!user) {
        // Create a new user without birthday or gender
        user = await this.userService.signUpToGoogle(id, email, fullName);
        console.log(user)
      }

      return user;
    } catch (error) {
      console.error('Error validating Google user:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      throw new Error('Failed to validate Google user');
    }
  }
}
