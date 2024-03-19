import mongoose from "mongoose";

export default mongoose.model("TicketCount", new mongoose.Schema({
	guild_id: String,
	user_id: String,
	count: { type: Number, default: 0 },
}));