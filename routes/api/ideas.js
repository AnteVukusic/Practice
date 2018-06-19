const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
//  Load User Model
const Idea = require("../../models/Idea");

//  Check if something is empty function
const isEmpty = require("../../validation/is-empty");

//  Load validation
const validateIdeaInput = require("../../validation/idea");
const validateEditIdeaInput = require("../../validation/editidea");
//  @route    Test route
//  @desc     Route for testing
//  @access   Public
router.get("/test", (req, res) => {
  return res.json({
    msg: "ideas success test route"
  });
});

//  @route    /api/ideas/
//  @desc     Route for post idea
//  @access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validateIdeaInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newIdea = new Idea({
      title: req.body.title,
      description: req.body.description,
      user: req.user.id
    });

    newIdea
      .save()
      .then(res.status(200).json(newIdea))
      .catch(err => console.log(err));
  }
);

//  @route    /api/ideas/vote
//  @desc     Upvote and downvote for idea
//  @access   Private
router.put(
  "/vote/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const ideaID = req.params.id;
    const errors = {};
    const vote = req.body.vote;
    Idea.findOne({
      _id: ideaID
    })
      .then(idea => {
        //  Check for errors
        if (!idea) {
          errors.ideaerrors = "There was an error,invalid idea id";
          return res.status(404).json(errors);
        }

        User.findOne({ _id: req.user.id }).then(user => {
          //  There is no record of user voting for idea,if changeg exist will be true
          let exists = false;
          //  If there is no change for db than avoid saving to db
          let handled = false;

          user.votes.filter(Vote => {
            if (Vote.idea_id == ideaID) {
              exists = true;
              if (Vote.idea_vote == vote) {
                errors.alreadyvoted = "user already voted for this one";
                handled = true;
                return res.status(400).json(errors);
              }
              //  If User already voted but he changed his mind
              vote == "true" ? (idea.vote += 2) : (idea.vote -= 2);
              Vote.idea_vote = vote;
            }
          });

          // If there is no object in votes array property
          if (user.votes.length == 0) {
            user.votes.push({
              idea_id: ideaID,
              idea_vote: vote
            });
            exists = true;
            vote == "true" ? idea.vote++ : idea.vote--;
          }
          //  If there is no vote with that idea_id in votes array of objects
          if (!exists) {
            user.votes.push({
              idea_id: ideaID,
              idea_vote: vote
            });
            vote == "true" ? idea.vote++ : idea.vote--;
          }
          if (!handled) {
            //  Save user and idea
            user.save().catch(err => console.log(err));
            idea
              .save()
              .then(idea => {
                return res.json(idea);
              })
              .catch(err => console.log(err));
          }
        });
      })
      .catch(err => console.log(err));
  }
);

//  @route    /api/ideas/getideas
//  @desc     Get list of ideas
//  @access   Public

router.get("/getideas", (req, res) => {
  Idea.find()
    .sort({ date: "desc" })
    .then(ideas => {
      return res.json(ideas);
    });
});

//  @route    /api/ideas/:id
//  @desc     Edit idea
//  @access   Private
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //  If there is some change for idea in db than change will be true
    let change = false;
    //  Check for input errors
    const { errors, isValid } = validateEditIdeaInput(req.body);
    if (!isValid) {
      return res.json(errors);
    }
    Idea.findById(req.params.id)
      .then(idea => {
        if (!idea) {
          errors.noidea = "There is no idea for that parameters";
          return res.json(errors);
        }
        if (idea.user != req.user.id) {
          errors.notauthorised =
            "Your have no rights to edit other users ideas";
          return res.json(errors);
        }
        if (!isEmpty(req.body.title)) {
          idea.title = req.body.title;
          change = true;
        }
        if (!isEmpty(req.body.description)) {
          idea.description = req.body.description;
          change = true;
        }
        if (change) {
          idea
            .save()
            .then(idea => {
              return res.json(idea);
            })
            .catch(err => console.log(err));
        }
      })

      .catch(err => console.log(err));
  }
);

module.exports = router;
