import { Schema } from 'mongoose';
const UserSchema = new Schema('User', {
  id: String,
  commands: [String],
  achievements: [String],
});
