import mongoose, { Document, Schema } from 'mongoose';

interface UserInterface extends Document {
    email: string;
    password: string;
}

const userSchema: Schema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;
