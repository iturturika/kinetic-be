import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

export default mongoose.model('Paticipant', ParticipantSchema);
