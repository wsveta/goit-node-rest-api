import { mongoose, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const contactsSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false });

contactsSchema.plugin(mongoosePaginate);

export default mongoose.model("Contact", contactsSchema);