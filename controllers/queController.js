import Que from "../models/Que.js";
import Session from "../models/Session.js";

{
  /*Add que
  @route
  @access
  */
}

export const addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ msg: "Invalid input" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ msg: "No Session" });
    }

    //new que

    const createQue = await Que.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );

    //Update
    session.questions.push(...createQue.map((q) => q._id));
    await session.save();

    res.status(201).json(createQue);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export const togglePinQuestion = async (req, res) => {
  try {
    const que = await Que.findById(req.params.id);
    if (!que) {
      return res.status(404).json({ success: false, msg: "No Question" });
    }

    que.isPinned = !que.isPinned;
    await que.save();

    res.status(200).json({ success: true, que });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export const updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;
    const que = await Que.findById(req.params.id);

    if (!que) {
      return res.status(404).json({ success: false, msg: "No Question" });
    }

    que.note = note || "";
    await que.save();

    res.status(200).json({ success: true, que });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
