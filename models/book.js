const mongoose = require("mongoose");

const libraryBookSchema = new mongoose.Schema(
  {
    bookTitle: {
      type: String,
      required: [true, "Book title is required"],
      trim: true
    },

    authorName: {
      type: String,
      default: ""
    },

    bookCategory: {
      type: String,
      default: ""
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  }
);

const LibraryBook = mongoose.model("LibraryBook", libraryBookSchema);

module.exports = LibraryBook;