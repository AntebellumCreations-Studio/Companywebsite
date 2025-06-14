import { IUser } from '../../interfaces/user.interface';
import UserModel from '../models/user.model';

class UserDao {
  async getUserByUsername(emailOrUsername: string): Promise<IUser | null> {
    return await UserModel.findOne({ username: emailOrUsername }).lean();
  }

  async getUserByEmail(emailOrUsername: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: emailOrUsername }).lean();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await UserModel.findById(userId).lean();
  }

  async listUsers(query: any = {}, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<IUser[]> {
    // build the query
    let users = UserModel.find(query);
    if (paginate.skip) users = users.skip(paginate.skip);
    if (paginate.limit) users = users.limit(paginate.limit);
    users = users.sort(sort).select(select);
    // execute the query
    return await users.lean();
  }

  async create(user: IUser): Promise<IUser> {
    return await UserModel.create(user);
  }

  async update(userId: string, user: IUser): Promise<IUser | null> {
    console.log(user);
    return await UserModel.findByIdAndUpdate(userId, user, { new: true }).lean();
  }

  async delete(userId: string): Promise<IUser | null> {
    return await UserModel.findByIdAndDelete(userId).lean();
  }

  async getFollowing(userId: string): Promise<IUser | null> {
    let user = await UserModel.findById(userId).select('following').populate('following', 'username bio profilePicture').lean();
    return user;
  }

  async getFollowers(userId: string): Promise<IUser | null> {
    let followers = await UserModel.findById(userId).select('followers').populate('followers', 'username bio profilePicture').lean();
    return followers;
  }

  async addToFollowing(userId: string, followingId: string): Promise<IUser | null> {
    let user = await UserModel.findByIdAndUpdate(userId, { $addToSet: { following: followingId } }, { new: true }).select('following');
    return user;
  }

  async addToFollowers(userId: string, followerId: string) {
    await UserModel.findByIdAndUpdate(userId, { $addToSet: { followers: followerId } });
  }

  async removeFromFollowing(userId: string, followingId: string): Promise<IUser | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { $pull: { following: followingId } }, { new: true }).select('following');

    return updatedUser;
  }

  removeFromFollowers(userId: string, followerId: string) {
    return UserModel.findByIdAndUpdate(userId, { $pull: { followers: followerId } });
  }
}
export default UserDao;
