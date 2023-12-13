const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const userService = require("./user-service.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Meeting = require("google-meet-api").meet;
const session = require("express-session");

app.use(express.json({ limit: "25mb" }));

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(cors());
const HTTP_PORT = process.env.PORT || 8080;

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = process.env.JWT_SECRET;

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log("payload received", jwt_payload);

  if (jwt_payload) {
    next(null, {
      _id: jwt_payload._id,
      email: jwt_payload.email,
    });
  } else {
    next(null, false);
  }
});

passport.use(strategy);
app.use(passport.initialize());

const clientID = process.env.GOOGLE_MEET_CLIENT_ID;
const clientSecret = process.env.GOOGLE_MEET_CLIENT_SECRET;

global.meetingResult;

app.use(
  session({
    secret: process.env.SESSION_SCERET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Connected to server!!");
});

app.get(
  "/auth/callback",
  passport.authenticate("google", {
    failureRedirect:
      "https://prj-566-666-naa-team-01.vercel.app/success-payment",
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: "openid email profile https://www.googleapis.com/auth/calendar",
    accessType: "offline",
    prompt: "consent",
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "https://cyan-wild-mussel.cyclic.app/auth/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      Meeting({
        clientId: clientID,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        date: "2023-10-30",
        time: "12:00",
        checking: 0,
      })
        .then(function (result) {
          meetingResult = result;
        })
        .catch((error) => {
          console.log(error);
        });
      return cb();
    }
  )
);

app.post("/register", async (req, res) => {
  if (!req.body.token) {
    return res.status(400).json({ error: "Token is missing" });
  }

  const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.token}`;
  const response = await axios.post(googleVerifyUrl);
  const { success } = response.data;

  if (success) {
    userService
      .registerUser(req.body.user)
      .then((msg) => {
        res.json({ message: msg });
      })
      .catch((msg) => {
        res.status(422).json({ message: msg });
      });
  } else {
    res.status(422).json({ message: "Unable to register user" });
  }
});

app.post("/login", (req, res) => {
  let mentor = false;
  userService
    .checkUser(req.body)
    .then((user) => {
      if (user.isMentor === true) {
        mentor = true;
      }

      let payload = {
        _id: user._id,
        email: user.email,
        mentor: mentor,
      };

      let token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ message: "login successful", token: token });
    })
    .catch((msg) => {
      res.status(422).send({ message: msg });
    });
});

app.get("/logout", function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        res.status(422).json({ message: err });
      } else {
        res.json({ message: "login successful", token: token });
        res.redirect("/");
      }
    });
  }
});

app.delete("/delete", (req, res) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, jwtOptions.secretOrKey, function (err, decoded) {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token provided");
      } else {
        userService
          .removeUser(decoded._id)
          .then((msg) => {
            res.json({ message: "User Deleted Successfully", msg });
          })
          .catch((msg) => {
            res.status(422).json({ error: msg });
          });
      }
    });
  }
});

app.put("/update", async (req, res) => {
  try {
    const updatedData = req.body;
    const token =
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"] ||
      req.cookies.token;

    if (updatedData) {
      cloudinary.uploader.upload(
        updatedData.profilePicture,
        opts,
        (error, result) => {
          if (result && result.secure_url) {
            updatedData.profilePicture = result.secure_url;
            if (!token) {
              res.status(401).send("Unauthorized: No token provided");
            } else {
              jwt.verify(
                token,
                jwtOptions.secretOrKey,
                function (err, decoded) {
                  if (err) {
                    res
                      .status(401)
                      .send("Unauthorized: Invalid token provided");
                  } else {
                    userService.updateUser(decoded._id, updatedData);
                    res.json({ message: "User Updated Successfully" });
                  }
                }
              );
            }
          } else {
            res.status(422).json({ error: "Error uploading" });
          }
        }
      );
    }
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

app.get("/dashboard", (req, res) => {
  userService
    .getMentors()
    .then((mentors) => {
      res.json(mentors);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.get("/students", (req, res) => {
  userService
    .getMentees()
    .then((mentors) => {
      res.json(mentors);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.post("/comment/:mentorId", async (req, res) => {
  const mentorId = req.params.mentorId;
  const review = req.body.review;
  const rating = req.body.rating;
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, jwtOptions.secretOrKey, async function (err, decoded) {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token provided");
      } else {
        try {
          const student = await userService.getStudentProfile(decoded._id);
          const mentor = await userService.getStudentProfile(mentorId);
          const successfulInvitations = student.invitations.filter(
            (inv) =>
              inv.mentorId.toString() === mentorId &&
              inv.status === "success" &&
              new Date(inv.meetingTime) < new Date()
          );

          if (successfulInvitations.length === 0) {
            return res.status(400).json({
              message: "You can only comment on successful invitations.",
            });
          }

          const numberOfSuccessfulInvitations = successfulInvitations.length;

          const numberOfComments = mentor.comments.filter(
            (comment) => comment.personId.toString() === decoded._id
          ).length;

          if (numberOfComments >= numberOfSuccessfulInvitations) {
            return res.status(400).json({
              message:
                "You have already commented on all successful invitations from this mentor.",
            });
          }

          userService
            .postComment(mentorId, review, rating, decoded._id)
            .then((msg) => {
              res.json({ message: msg });
            })
            .catch((error) => {
              res.status(422).json({ error: error });
            });
        } catch (error) {
          res.status(422).json({ error: error.message });
        }
      }
    });
  }
});

app.get("/mentor/:userId", (req, res) => {
  const userId = req.params.userId;
  userService
    .getMentorProfile(userId)
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      res.status(422).json({ error: error });
    });
});

app.get("/profile", function (req, res) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, jwtOptions.secretOrKey, function (err, decoded) {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token provided");
      } else {
        userService
          .getStudentProfile(decoded._id)
          .then((user) => {
            res.json(user);
          })
          .catch((error) => {
            res.status(422).json({ error: error });
          });
      }
    });
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const message = await userService.forgotPassword(userEmail);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed" });
  }
});

app.put("/change-password", async (req, res) => {
  try {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    const token =
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"] ||
      req.cookies.token;

    if (!token) {
      res.status(401).send("Unauthorized: No token provided");
    } else {
      jwt.verify(token, jwtOptions.secretOrKey, function (err, decoded) {
        if (err) {
          console.log("error");
          res.status(401).send("Unauthorized: Invalid token provided");
        } else {
          const message = userService.changePasswordById(
            decoded._id,
            currentPassword,
            newPassword
          );
          res.json({ message });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.get("/invitation/:invitationId", async (req, res) => {
  const id = req.params.invitationId;

  try {
    const invitation = await userService.getInvitationById(id);
    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    const invitationFiltered = invitation.filter((inv) => inv._id == id);
    console.log(invitationFiltered);

    res.send(invitationFiltered);
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.post("/create-payment-intent/:invitationId/:amount", async (req, res) => {
  const invitationId = req.params.invitationId;
  const amount = req.params.amount;

  try {
    const invitation = await userService.getInvitationById(invitationId);
    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "CAD",
      amount: amount * 100,
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.post("/send-invitation", async (req, res) => {
  const invitationInfo = req.body;
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  var mentorId = 0;

  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, jwtOptions.secretOrKey, function (err, decoded) {
      if (err) {
        console.log("error");
        res.status(401).send("Unauthorized: Invalid token provided");
      } else {
        mentorId = decoded._id;
      }
    });
  }

  try {
    await userService.addInvitation(
      mentorId,
      invitationInfo.studentEmail,
      invitationInfo.details,
      invitationInfo.meetingTime,
      invitationInfo.totalCharges
    );
    res.json({ message: "Invitation sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send invitation" });
  }
});

app.post("/update-invitation-status/:id/:status", async (req, res) => {
  try {
    const invitationId = req.params.id;
    const invitationStatus = req.params.status;

    if (!invitationId || !invitationStatus) {
      return res.status(500).json({ error: "Missing required parameters" });
    }
    if (invitationStatus === "failed") {
      await userService.updateInvitationStatus(invitationId, invitationStatus);
    } else if (meetingResult != "") {
      await userService.updateInvitationStatus(
        invitationId,
        invitationStatus,
        meetingResult
      );
      meetingResult = "";
    } else {
      return res.status(400).json({ error: "Internal server error" });
    }

    return res
      .status(200)
      .json({ message: "Invitation status updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/invitations", async (req, res) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  var userId = 0;

  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, jwtOptions.secretOrKey, function (err, decoded) {
      if (err) {
        console.log("error");
        res.status(401).send("Unauthorized: Invalid token provided");
      } else {
        userId = decoded._id;
      }
    });
  }

  try {
    const invitations = await userService.getInvitationsById(userId);

    res.json(invitations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invitations" });
  }
});

app.post("/search", async (req, res) => {
  const { query } = req.body;

  try {
    const result = await userService.saveSearchQuery(query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Search route error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/suggestions", async (req, res) => {
  try {
    const suggestions = await userService.getTopSearchSuggestions();
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/mentor-invitations/:mentorId", async (req, res) => {
  const mentorId = req.params.mentorId;

  try {
    const invitations = await userService.getInvitationsForMentor(mentorId);
    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/mentor/:mentorId/earnings", async (req, res) => {
  const mentorId = req.params.mentorId;

  try {
    const invitations = await userService.getEarnings(mentorId);
    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/student/:studentId/spending", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const invitations = await userService.getSpending(studentId);
    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/update-invitation/:invitationId", async (req, res) => {
  const invitationId = req.params.invitationId;

  const { description, meetingTime } = req.body;

  const updatedData = {
    description,
    meetingTime,
  };
  try {
    const message = await userService.updateInvitation(
      invitationId,
      updatedData
    );
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/invitations/:invitationId", async (req, res) => {
  const invitationId = req.params.invitationId;
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, jwtOptions.secretOrKey, async function (err, decoded) {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token provided");
      } else {
        try {
          const message = await userService.deleteInvitation(
            decoded._id,
            invitationId
          );
          res.json({ message });
        } catch (error) {
          res.status(500).json({ error: "Failed to delete invitation" });
        }
      }
    });
  }
});

userService
  .connect()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("API listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
  });
