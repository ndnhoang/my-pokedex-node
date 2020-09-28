const express = require("express");
const router = express.Router();

const Friend = require("../models/friendSchema");

router.post("/add-friend", (req, res) => {
  Friend.findOne(
    { fromUser: req.body.fromUser, destinationUser: req.body.destinationUser },
    (err, result) => {
      if (err) return res.json({ status: "error" });
      if (!result) {
        Friend.findOne(
          {
            fromUser: req.body.destinationUser,
            destinationUser: req.body.fromUser,
          },
          (err, result) => {
            if (err) return res.json({ status: "error" });
            if (!result) {
              let friendModel = new Friend({
                fromUser: req.body.fromUser,
                destinationUser: req.body.destinationUser,
                status: false
              });
              friendModel.save((err) => {
                if (err) return res.json({ status: "error" });
                let io = req.app.get('socketio');
                io.emit('responseAddFriend', {id: req.body.destinationUser, message: "Accept"});
                return res.json({ status: "success", message: "Waiting" });
              });
            } else {
              res.json({ status: "error" });
            }
          }
        );
      } else {
        return res.json({ status: "error" });
      }
    }
  );
});

router.post("/friend", (req, res) => {
    Friend.findOne(
      { fromUser: req.body.fromUser, destinationUser: req.body.destinationUser },
      (err, result) => {
        if (err) return res.json({ status: "error" });
        if (!result) {
          Friend.findOne(
            {
              fromUser: req.body.destinationUser,
              destinationUser: req.body.fromUser,
            },
            (err, result) => {
              if (err) return res.json({ status: "error" });
              if (!result) {
                return res.json({ status: "success", message: "Add friend" });
              } else {
                res.json({ status: "success", message: "Accept" });
              }
            }
          );
        } else {
          return res.json({ status: "success", message: "Waiting" });
        }
      }
    );
  });

module.exports = router;
