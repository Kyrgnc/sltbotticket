import mongoose from "mongoose";

export default mongoose.model("Ticket", new mongoose.Schema({
	guild_id: String,
	channelnoticeid: { type: String },
	buttonName: { type: String },
	buttonColor: { type: String },
	buttonEmoji: { type: String },
	categoryconfirm: { type: String },
	channelconfirm: { type: String },
	channellog: { type: String },
	rolecreated: { type: String },
	roleconfirm: { type: String },
	menutopics: { type: String },
	msg: { type: String }
}));