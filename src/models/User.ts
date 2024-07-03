import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  telegramId: string;
  username: string;
  points: number;
  referrals: number;
}

const userSchema = new Schema<IUser>({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  points: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 },
});

const User = model<IUser>("User", userSchema);

export default User;
