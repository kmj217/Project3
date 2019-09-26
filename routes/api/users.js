/*
THIS FILE SHOULD CONTAIN PROTECTED (AUTHENTICATED) ROUTES ONLY

These are routes like Get a Profile and a Dashboard that require a JWT to access.
*/

const router = require("express").Router();
let User = require("../../models/userModel");
let Lift = require("../../models/liftModel");
const passport = require("passport");
const bcrypt = require("bcrypt");
const exerciseController = require("../../controllers/exerciseController");
const jwt = require('jsonwebtoken');

/*CHECK TOKEN*/
const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if(typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1];

      req.token = token;
      next();
  } else {
      //If header is undefined return Forbidden (403)
      console.log("ERROR: Could not connect to the protected route.")
      res.sendStatus(403)
  }
} 

/*
GET USER DATA
This API should determine the user and return their data (JSON) 
so that the front end can render it 
*/

router
  .route("/dashboard")
  // .get(exerciseController.findAll)
  .get(checkToken, (req, res) => {
    //verify the JWT token generated for the user
    jwt.verify(req.token, 'your_jwt_secret', (err) => {
      if (err) {
        //If error send Forbidden (403)
        // console.log("ERROR: Could not connect to the protected route");
        // res.sendStatus(403);
        // res.status(403).json(err); 
        console.log("ERROR: Could not connect to the protected route.");
      } else {
        //If token is successfully verified, we can send the autorized data
        exerciseController.findAll(req, res); 
        console.log("SUCCESS: Connected to protected route.");
      }
    });
  });
//   .post(exerciseController.create);

/*
SAVE EXERCISE
This API saves a new document to the collection.
*/
router
.route("/addnewlift")
.post(checkToken, (req, res) => {
  //verify the JWT token generated for the user
  jwt.verify(req.token, 'your_jwt_secret', (err) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
      console.log("ERROR: Could not connect to the protected route to add a new exercise.");
    } else {
      //If token is successfully verified, we can send the authorized data
      // console.log(req.user);
      var query = {
        liftName: req.query.liftName,
        reps: req.query.reps,
        pr: req.query.pr, 
        userID: req.query.userID
      };
      console.log("line 81 ",  query);
      // Return either basic json or a 401
      exerciseController.create(query, res)
        // .then (function(dbLift) { 
        //   return db.Users.findOneAndUpdate( { _id: req.params.userId }, { lift: dbLift._id }, { new: true } );
        // }) 
        // .then (function (dbUser) {
        //   res.json(dbUser);  
        // })
        // .catch (function(err) { 
        //   res.json(err); 
        // })
      console.log("SUCCESS: Connected to protected route to add a new exercise.");
    }
  });
});

/*
UPDATE EXERCISE
This API updates an existing document in the collection.
*/
router
.route("/update/:id")
.put(checkToken, (req, res) => {
  //verify the JWT token generated for the user
  jwt.verify(req.token, 'your_jwt_secret', (err) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
      console.log("ERROR: Could not connect to the protected route to update a exercise.");
    } else {
      //If token is successfully verified, we can send the authorized data
      // Return either basic json or a 401
      exerciseController.update(req, res);
      console.log("SUCCESS: Connected to protected route to update a exercise.");
    }
  });
});
/*
DELETE EXERCISE
This API updates an existing document in the collection.
*/
router
.route("/:id")
.delete(checkToken, (req, res) => {
  //verify the JWT token generated for the user
  jwt.verify(req.token, 'your_jwt_secret', (err) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
      console.log("ERROR: Could not connect to the protected route to delete a exercise.");
    } else {
      //If token is successfully verified, we can send the authorized data
      // Return either basic json or a 401
      exerciseController.delete(req, res);
      console.log("SUCCESS: Connected to protected route to delete a exercise.");
    }
  });
});
// router.route("/:id").delete((req, res) => {
//   exerciseController.delete(req, res);
// });
/*
LOGOUT
Self-explanatory
*/

module.exports = router;
