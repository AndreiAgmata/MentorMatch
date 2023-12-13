const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
const { default: axios } = require("axios");

let mongoDBConnectionString = process.env.MONGO_URL;

let Schema = mongoose.Schema;

let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: String,
  isMentor: {
    type: Boolean,
    default: false,
  },
  userDesc: {
    type: String,
    default: "",
  },
  courses: {
    type: [String],
    default: [],
  },
  profilePicture: {
    type: String,
    default: "",
  },
  transcriptFile: {
    type: String,
    default: "",
  },
  comments: [
    {
      personId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        default: "Commenter",
      },
      review: {
        type: String,
        default: "",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
      },
    },
  ],
  invitations: [
    {
      mentorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      studentId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      description: String,
      meetingTime: String,
      totalCharges: Number,
      status: {
        type: String,
        enum: ["inProgress", "success", "failed"],
        default: "inProgress",
      },
      meetingLink: String,
    },
  ],
});

const searchQuerySchema = new Schema({
  query: {
    type: String,
    required: true,
    unique: true,
  },
  frequency: {
    type: Number,
    default: 1,
  },
  lastSearched: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(beautifyUnique);
let SearchQuery;
let User;

module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(mongoDBConnectionString);

    db.on("error", (err) => {
      reject(err);
      console.error("Error connecting to MongoDB:", err);
    });

    db.once("open", () => {
      User = db.model("users", userSchema);
      SearchQuery = db.model("SearchQuery", searchQuerySchema);
      console.log("Connected to MongoDB");
      resolve();
    });
  });
};

module.exports.saveSearchQuery = async function (query) {
  try {
    let searchQuery = await SearchQuery.findOne({ query });

    if (searchQuery) {
      searchQuery.frequency += 1;
      searchQuery.lastSearched = Date.now();
      await searchQuery.save();
    } else {
      searchQuery = await SearchQuery.create({ query });
    }

    return { message: "Search query saved successfully" };
  } catch (error) {
    throw new Error("Error saving search query: " + error.message);
  }
};

module.exports.getTopSearchSuggestions = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const suggestions = await SearchQuery.find({})
        .sort({ frequency: -1, lastSearched: -1 })
        .limit(10)
        .exec();

      resolve(suggestions);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.registerUser = async function (userData) {
  try {
    userData.email = userData.email.toLowerCase();
    const existingUserEmail = await User.findOne({
      email: { $regex: new RegExp(userData.email, "i") },
    });

    if (existingUserEmail) {
      throw "User with email " + userData.email + " already exists";
    }

    if (!userData.email.toLowerCase().endsWith("@myseneca.ca")) {
      throw "Invalid Seneca Email";
    }

    if (userData.password !== userData.password2) {
      throw "Passwords do not match";
    }

    const hash = await bcrypt.hash(userData.password, 10);
    userData.password = hash;

    let newUser = new User(userData);

    await newUser.save();
    return userData.firstName + " registered successfully";
  } catch (err) {
    if (err.code === 11000) {
      throw "User with email " + userData.email + " already exists";
    } else {
      throw "There was an error creating the user: " + err;
    }
  }
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.findOne({ email: userData.email })
      .exec()
      .then((user) => {
        bcrypt.compare(userData.password, user.password).then(async (res) => {
          if (res === true) {
            resolve(user);
          } else {
            reject("Incorrect password for user " + userData.email);
          }
        });
      })
      .catch((err) => {
        reject("User not found");
      });
  });
};

module.exports.removeUser = function (userId) {
  return new Promise(function (resolve, reject) {
    User.findByIdAndDelete(userId)
      .exec()
      .then((user) => {
        if (user) {
          resolve(user.email);
        } else {
          reject("User not found");
        }
      })
      .catch((err) => reject(err));
  });
};

module.exports.uploadImage = function (userId, image) {};

module.exports.updateUser = function (userId, updatedData) {
  delete updatedData.password;
  return new Promise(function (resolve, reject) {
    User.findByIdAndUpdate(userId, updatedData)
      .exec()
      .then(() => {
        resolve("User updated successfully");
      })
      .catch((err) => reject(err));
  });
};

module.exports.getStudentProfile = function (userId) {
  return new Promise(function (resolve, reject) {
    User.findById(userId)
      .exec()
      .then((user) => {
        if (!user) {
          reject("User not found");
        } else {
          resolve(user);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getMentorProfile = function (userId) {
  return new Promise(function (resolve, reject) {
    User.findById(userId)
      .populate({
        path: "comments",
        populate: {
          path: "personId",
          model: "users",
          select: "firstName",
        },
      })
      .select("-password")
      .exec()
      .then((user) => {
        if (!user) {
          reject("User not found");
        } else if (!user.isMentor) {
          reject("User is not a mentor");
        } else {
          resolve(user);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getMentors = function () {
  return new Promise(function (resolve, reject) {
    User.find({ isMentor: true }, { password: 0 })
      .exec()
      .then((mentors) => {
        resolve(mentors);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports.getMentees = function () {
  return new Promise(function (resolve, reject) {
    User.find({ isMentor: false }, { password: 0 })
      .exec()
      .then((mentors) => {
        resolve(mentors);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports.postComment = function (mentorId, review, rating, commenterId) {
  return new Promise(function (resolve, reject) {
    User.findById(mentorId)
      .exec()
      .then((targetUser) => {
        if (!targetUser) {
          reject("Mentor not found");
        } else {
          User.findById(commenterId)
            .exec()
            .then((commenter) => {
              const comment = {
                personId: commenter._id,
                name: `${commenter.firstName} ${commenter.lastName}`,
                review,
                rating,
              };

              targetUser.comments.push(comment);

              targetUser
                .save()
                .then(() => {
                  resolve("Comment posted successfully");
                })
                .catch((err) => {
                  reject(err);
                });
            });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.forgotPassword = async function (userEmail) {
  try {
    const newPassword = generateRandomPassword(10);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(userEmail, hashedPassword);

    await sendPasswordResetEmail(userEmail, newPassword);

    return "Password reset successful. Check your email for the new password.";
  } catch (error) {
    throw error;
  }
};

function updateUserPassword(email, newPassword) {
  return new Promise(function (resolve, reject) {
    User.findOne({ email })
      .exec()
      .then((user) => {
        if (user) {
          user.password = newPassword;
          user.usingTempPass = true;
          user
            .save()
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject("User not found");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function generateRandomPassword(length) {
  const characters = process.env.PASS_CHAR;
  let randomPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPassword += characters.charAt(randomIndex);
  }
  return randomPassword;
}

async function sendPasswordResetEmail(userEmail, newPassword) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: userEmail,
    subject: "Password Reset",
    text: `Your new password is: ${newPassword}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

module.exports.changePasswordById = async function (
  userId,
  currentPassword,
  newPassword
) {
  try {
    const user = await User.findById(userId).exec();

    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    return "Password changed successfully";
  } catch (error) {
    throw error;
  }
};

module.exports.addInvitation = function (
  mentorId,
  studentEmail,
  details,
  meetingTime,
  totalCharges
) {
  return new Promise(async (resolve, reject) => {
    try {
      const student = await User.findOne({ email: studentEmail }).exec();
      console.log(student._id.toString());
      const invitation = {
        mentorId: mentorId,
        studentId: student._id.toString(),
        description: details,
        meetingTime: meetingTime,
        totalCharges: totalCharges,
      };

      if (!student) {
        throw new Error("Student not found");
      }

      student.invitations.push(invitation);

      await student.save();

      resolve("Invitation added successfully");
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getInvitationById = function (invitationId) {
  return new Promise(async (resolve, reject) => {
    try {
      const invitation = await User.findOne({
        "invitations._id": invitationId,
      }).exec();

      if (!invitation) {
        throw new Error("Invitation not found");
      }

      resolve(invitation.invitations);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getInvitationsById = function (userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId).exec();

      if (!user) {
        throw new Error("User not found");
      }

      const invitations = user.invitations;

      const results = await Promise.all(
        invitations.map(async (invitation) => {
          const mentor = await User.findOne({
            _id: invitation.mentorId,
          }).exec();

          if (!mentor) {
            throw new Error("Mentor not found");
          }

          return {
            ...invitation.toObject(),
            mentorName: mentor.firstName + " " + mentor.lastName,
          };
        })
      );

      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.updateInvitationStatus = function (
  invitationId,
  status,
  meetingResult
) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        "invitations._id": invitationId,
      }).exec();

      if (!user) {
        throw new Error("User not found");
      }

      const invitation = user.invitations.find(
        (inv) => inv._id.toString() === invitationId
      );
      if (!invitation) {
        throw new Error("Invitation not found");
      }

      invitation.status = status;

      if (status === "success") {
        invitation.meetingLink = meetingResult;
        await sendMeetingLink(
          invitation.mentorId,
          invitation.studentId,
          invitation.meetingLink,
          invitation.description,
          invitation.totalCharges,
          invitation.status
        );
      }

      await user.save();

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

async function findUserName(userID) {
  try {
    const user = await User.findById(userID).exec();

    if (!user) {
      throw new Error("User not found");
    }
    const fullName = `${user.firstName} ${user.lastName}`;
    return fullName;
  } catch (error) {
    throw error;
  }
}

async function findUserMail(userID) {
  try {
    const user = await User.findById(userID).exec();
    if (!user) {
      throw new Error("User not found");
    }
    const fullMail = user.email;
    return fullMail;
  } catch (error) {
    throw error;
  }
}

async function sendMeetingLink(
  mentorId,
  studentId,
  meetlink,
  description,
  totalCharges,
  status
) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
  });

  let mentorName = await findUserName(mentorId);
  let mentormailId = await findUserMail(mentorId);

  let studentName = await findUserName(studentId);
  let studentmailId = await findUserMail(studentId);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: mentormailId,
    subject: `MentorMatch: Your Meeting has been confirmed`,
    text: `
    Hi ${mentorName},\n 
    Your meeting has been confirmed. Below are the details: 
    Description: ${description}
    Student: ${studentName}
    Meeting Link: ${meetlink}
    Money Paid: $${totalCharges}
    Status: ${status}
    Check Portal for more information.\n
    Sincerely,
    Team MentorMatch`,
  };

  const mailOptions2 = {
    from: process.env.SENDER_EMAIL,
    to: studentmailId,
    subject: `MentorMatch: Your Meeting has been confirmed`,
    text: `
    Hi ${studentName},\n 
    Your meeting has been confirmed. Below are the details: 
    Description: ${description}
    Mentor: ${mentorName}
    Meeting Link: ${meetlink}
    Money Paid: $${totalCharges}
    Status: ${status}
    Check Portal for more information.\n
    Sincerely,
    Team MentorMatch`,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptions2);
    console.log("Meeting link email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

module.exports.getInvitationsForMentor = async function (mentorId) {
  try {
    const invitations = await User.find({
      "invitations.mentorId": mentorId,
    }).exec();

    const mentorInvitations = await Promise.all(
      invitations.map(async (user) => {
        const mentorInvites = user.invitations.filter((invitation) =>
          invitation.mentorId.equals(mentorId)
        );
        const invitationsWithStudentNames = await Promise.all(
          mentorInvites.map(async (invitation) => {
            const student = await User.findOne({ _id: invitation.studentId });
            return {
              ...invitation.toObject(),
              studentName: student
                ? student.firstName + " " + student.lastName
                : "Unknown Student",
            };
          })
        );
        return invitationsWithStudentNames;
      })
    );

    const flattenedInvitations = mentorInvitations.reduce(
      (accumulator, currentInvitations) =>
        accumulator.concat(currentInvitations),
      []
    );

    return flattenedInvitations;
  } catch (error) {
    throw error;
  }
};

module.exports.updateInvitation = function (invitationId, updatedData) {
  return new Promise(async (resolve, reject) => {
    try {
      const usersWithInvitations = await User.find({
        "invitations._id": invitationId,
      }).exec();

      const updatedInvitations = [];

      usersWithInvitations.forEach((user) => {
        const invitationIndex = user.invitations.findIndex((invitation) =>
          invitation._id.equals(invitationId)
        );

        if (invitationIndex !== -1) {
          if (updatedData.description) {
            user.invitations[invitationIndex].description =
              updatedData.description;
          }

          if (updatedData.meetingTime) {
            user.invitations[invitationIndex].meetingTime =
              updatedData.meetingTime;
          }

          updatedInvitations.push(user.save());
        }
      });

      await Promise.all(updatedInvitations);

      resolve("Invitation updated successfully");
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getEarnings = async function (mentorId) {
  try {
    const invitations = await User.find({
      "invitations.mentorId": mentorId,
    }).exec();
    const currentMonth = new Date().getUTCMonth();

    const mentorInvitations = await Promise.all(
      invitations.map(async (user) => {
        const mentorInvites = user.invitations.filter(
          (invitation) =>
            invitation.mentorId.equals(mentorId) &&
            invitation.status === "success"
        );

        const overallCharges = mentorInvites.reduce(
          (sum, invitation) => sum + invitation.totalCharges,
          0
        );

        const monthCharges = mentorInvites
          .filter(
            (invitation) =>
              new Date(invitation.meetingTime).getUTCMonth() === currentMonth
          )
          .reduce((sum, invitation) => sum + invitation.totalCharges, 0);

        return { overallCharges, monthCharges };
      })
    );

    const totalOverallCharges = mentorInvitations.reduce(
      (sum, currentInvitation) => sum + currentInvitation.overallCharges,
      0
    );

    const totalMonthCharges = mentorInvitations.reduce(
      (sum, currentInvitation) => sum + currentInvitation.monthCharges,
      0
    );

    return {
      overallCharges: totalOverallCharges,
      monthCharges: totalMonthCharges,
    };
  } catch (error) {
    throw error;
  }
};

module.exports.getSpending = function (userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId).exec();

      if (!user) {
        throw new Error("User not found");
      }

      const invitations = user.invitations;

      const currentMonth = new Date().getUTCMonth();

      const results = await Promise.all(
        invitations.map(async (invitation) => {
          if (invitation.status === "success") {
            const mentor = await User.findOne({
              _id: invitation.mentorId,
            }).exec();

            if (!mentor) {
              throw new Error("Mentor not found");
            }

            return {
              ...invitation.toObject(),
            };
          }
        })
      );

      const validResults = results.filter((result) => result);

      const overallSpending = validResults.reduce(
        (sum, result) => sum + result.totalCharges,
        0
      );

      const monthSpending = validResults
        .filter(
          (result) =>
            new Date(result.meetingTime).getUTCMonth() === currentMonth
        )
        .reduce((sum, result) => sum + result.totalCharges, 0);

      resolve({ overallSpending, monthSpending });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.deleteInvitation = async function (userId, invitationId) {
  try {
    const user = await User.findOne({
      _id: userId,
      "invitations._id": invitationId,
    }).exec();

    if (!user) {
      throw new Error("User or invitation not found");
    }

    const invitationIndex = user.invitations.findIndex(
      (invitation) => invitation._id.toString() === invitationId
    );

    if (invitationIndex === -1) {
      throw new Error("Invitation not found");
    }

    user.invitations.splice(invitationIndex, 1);
    await user.save();

    return "Invitation deleted successfully";
  } catch (error) {
    throw error;
  }
};