import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  city: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String, required: true },
  city: {type: String, required: true},
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
