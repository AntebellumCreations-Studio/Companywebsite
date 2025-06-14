import bcrypt from 'bcrypt';
import { injectable } from 'tsyringe';

import UserDao from '../DB/dao/user.dao';
import HttpException from '../exceptions/HttpException';
import { IUser } from '../interfaces/user.interface';
import { createToken } from '../utils/createToken';

@injectable()
export class AuthServie {
  constructor(private readonly userDao: UserDao) {}

  /**
   * Signup a new user
   * @param user - The user object to signup
   * @returns An object containing the newly created user and a token
   * @throws HttpException if the email or username already exists
   */
  async signup(user: IUser): Promise<{ user: IUser; token: string }> {
    // check if the user already exists
    let isEmailExists = await this.userDao.getUserByEmail(user.email);
    let isUsernameExists = await this.userDao.getUserByUsername(user.username);

    if (isEmailExists) {
      throw new HttpException(409, `E-Mail address ${user.email} is already exists, please pick a different one.`);
    } else if (isUsernameExists) {
      throw new HttpException(409, 'Username already in use');
    }

    // hash the password
    user.password = await bcrypt.hash(user.password, 10);

    let newUser = await this.userDao.create(user);

    let token = createToken(newUser._id!);
    return { user: newUser, token };
  }

  /**
   * Login a user
   * @param emailOrUsername - The email or username of the user to login
   * @param password - The password of the user to login
   * @returns An object containing the logged in user and a token
   * @throws HttpException if the email or username does not exist or the password is incorrect
   */
  async login(emailOrUsername: string, password: string): Promise<{ user: IUser; token: string }> {
    // Check if the input is an email or a username
    const isEmail = /\S+@\S+\.\S+/.test(emailOrUsername);

    let user: IUser | null;

    if (isEmail) {
      user = await this.userDao.getUserByEmail(emailOrUsername);
    } else {
      user = await this.userDao.getUserByUsername(emailOrUsername);
    }

    if (!user || !(await bcrypt.compare(password, user.password))) throw new HttpException(401, 'Incorrect (email | username) or password`');

    let token = createToken(user._id!);

    return { user, token };
  }
}
