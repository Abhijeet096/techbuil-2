import mongoose from 'mongoose';

const BlockSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    props: { type: Object, default: {} },
    children: { type: [Object], default: [] },
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    name: { type: String, required: true },
    tree: { type: BlockSchema, required: true },
  },
  { _id: false }
);

const SiteSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true },
    theme: { type: Object, default: {} },
    pages: { type: [PageSchema], default: [] },
    publishedAt: { type: Date },
    customDomain: { type: String },
    publishSlug: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Site', SiteSchema);
