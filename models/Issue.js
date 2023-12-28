// models/Issue.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String,
    default: ''
  },
  status_text: {
    type: String,
    default: ''
  },
  open: {
    type: Boolean,
    default: true
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  project: {
    type: String,
    required: true
  }
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
