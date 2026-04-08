const mongoose = require('mongoose');

const resolutionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    pdfLink: {
      type: String,
      required: true,
      trim: true,
    },
    dateDocketed: {
      type: Date,
      required: true,
    },
    datePublished: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['approved', 'pending'],
      default: 'approved',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.created_at = ret.createdAt;
        ret.updated_at = ret.updatedAt;
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Resolution', resolutionSchema);
