import Session from "../models/Session.js";
import Que from "../models/Que.js";

//Create session
export const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, desc, questions } = req.body;
    const userId = req.user._id;

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      desc,
    });

    const questionsDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Que.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    session.questions = questionsDocs;
    await session.save();

    res.status(201).json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

//Get all sessions

export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("questions");
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Session by id

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .exec();

    if (!session) {
      return res.status(404).json({ success: false, msg: "Session not exist" });
    }
    res.status(200).json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

//Delete session

export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ msg: "No session" });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Que.deleteMany({ session: session._id });

    await session.deleteOne();

    res.status(200).json();
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
