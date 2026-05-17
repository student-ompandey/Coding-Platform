import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  college: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  score: { type: Number, default: 0 },
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  joinedContest: { type: Boolean, default: false },
  status: { type: String, enum: ["active", "banned", "disqualified"], default: "active" },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
