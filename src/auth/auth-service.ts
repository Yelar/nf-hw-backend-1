import { CreateUserDto } from './dtos/CreateUser.dto';
import { IUser } from './models/User';
import UserModel from './models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import RefreshTokenModel from './models/RefreshToken';
import EventModel from '../events/models/Event';
import { Event } from '../events/types/response';
import { IEvent } from '../events/models/Event';
dotenv.config();

class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET!;
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
  async eventsInCity(email: string): Promise<(Event | IEvent | null)[]> {
    const dbUser = await UserModel.findOne({email});
    const userCity = dbUser?.city;
    return EventModel.find({location : userCity}).exec();
  }
  async registerUser(createUserDto: CreateUserDto): Promise<IUser> {
    const { email, password, username, city } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email,
      username,
      password: hashedPassword,
      city,
    });

    await newUser.save();
    return newUser;
  }

  async loginUser(email: string, password: string): Promise<{ user: IUser, accessToken: string, refreshToken: string } | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    
    const accessToken = this.generateJwt(user);
    const refreshToken = this.generateRefreshToken(user);

    const refreshTokenDoc = new RefreshTokenModel({ token: refreshToken, user: user._id });
    await refreshTokenDoc.save();

    return { user, accessToken, refreshToken };
  } 

  private generateJwt(user: IUser): string {
    console.log(process.env.JWT_SECRET);
    
    try {
      return jwt.sign({ id: user._id, email: user.email }, this.jwtSecret, { expiresIn: '15m' });
    } catch (error) {
      console.log(error)
    }
    return ''
  }

  private generateRefreshToken(user: IUser): string {
    return jwt.sign({ id: user._id, email: user.email }, this.jwtRefreshSecret, { expiresIn: '7d' });
  }

  verifyJwt(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      return null;
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtRefreshSecret);
    } catch (err) {
      return null;
    }
  }

  async refreshToken(oldToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {
    const payload = this.verifyRefreshToken(oldToken);
    if (!payload) return null;

    const user = await UserModel.findById(payload.id);
    if (!user) return null;

    const newAccessToken = this.generateJwt(user);
    const newRefreshToken = this.generateRefreshToken(user);

    const refreshTokenDoc = new RefreshTokenModel({ token: newRefreshToken, user: user._id });
    await refreshTokenDoc.save();

    await RefreshTokenModel.deleteOne({ token: oldToken });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

export default AuthService;
