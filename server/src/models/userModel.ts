import mongoos, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    otp?: string;
    otpExpiresAt?: Date;
    otpLastSentAt?: Date;
}

const userSchema = new Schema<IUser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    otp: {type: String },
    otpExpiresAt: {type: Date},
    otpLastSentAt: { type: Date }
})

const User = mongoos.model<IUser>('User', userSchema);

export default User;