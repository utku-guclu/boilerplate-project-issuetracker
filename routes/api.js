// routes/api.js

'use strict';

const mongoose = require('mongoose');

// Import your Issue model and any other necessary dependencies
const Issue = require('../models/Issue');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      const project = req.params.project;
      const filterObject = { project, ...req.query };

      try {
        const arrayOfResults = await Issue.find(filterObject);
        return res.json(arrayOfResults);
      } catch (error) {
        console.error(error);
        return res.json({ error: 'Error fetching issues' });
      }
    })

    .post(async function (req, res) {
      const project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const newIssue = new Issue({
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        open: true,
        created_on: new Date(),
        updated_on: new Date(),
        project
      });

      try {
        const savedIssue = await newIssue.save();
        return res.json(savedIssue);
      } catch (error) {
        console.error(error);
        return res.json({ error: 'Error saving new issue' });
      }
    })

    .put(async function (req, res) {
      const project = req.params.project;
      const { _id, ...updateObject } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      if (Object.keys(updateObject).length < 1) {
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      }

      updateObject.updated_on = new Date();

      try {
        const updatedIssue = await Issue.findByIdAndUpdate(
          _id,
          updateObject,
          { new: true }
        );

        if (updatedIssue) {
          return res.json({ result: 'successfully updated', '_id': _id });
        } else {
          return res.json({ error: 'could not update', '_id': _id });
        }
      } catch (error) {
        console.error(error);
        return res.json({ error: 'Error updating issue', '_id': _id });
      }
    })

    .delete(async function (req, res) {
      const project = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      try {
        const deletedIssue = await Issue.findOneAndDelete({ _id });

        if (deletedIssue) {
          return res.json({ result: 'successfully deleted', '_id': _id });
        } else {
          return res.json({ error: 'could not delete', '_id': _id });
        }
      } catch (error) {
        console.error(error);
        return res.json({ error: 'could not delete', '_id': _id });
      }
    });
};
