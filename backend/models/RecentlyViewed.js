const mongoose = require('mongoose');

const recentlyViewedSchema = new mongoose.Schema(
  {
    resolutionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    pdfLink: {
      type: String,
      default: '',
      trim: true,
    },
    dateDocketed: {
      type: Date,
      default: null,
    },
    datePublished: {
      type: Date,
      default: null,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.resolutionId;
        ret.viewed_at = ret.viewedAt;
        delete ret._id;
        delete ret.resolutionId;
        delete ret.viewedAt;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('RecentlyViewed', recentlyViewedSchema);
