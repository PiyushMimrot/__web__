import uni_topic from "../../Model/Main/uni_topicsModel.js";

export const addTopic = async (req, res) => {
  try {
    const newTopic = new uni_topic(req.body);
    const savedNewTopic = await newTopic.save();
    res.status(200).json(savedNewTopic);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const addManyTopics = async (req, res) => {
  try {
    const insertedTopics = await uni_topic.insertMany(req.body);
    res.status(201).json(insertedTopics);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const getAllTopics = async (req, res) => {
  try {
    const allTopics = await uni_topic.find({});
    res.status(200).json(allTopics);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const getOneTopic = async (req, res) => {
  try {
    const id = req.params.id;
    const topic = await uni_topic.findById(id);
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const getTopicsByChapt = async (req, res) => {
  try {
    const chaptID = req.params.id;
    const getTopic = await uni_topic.find({ chapter_id: chaptID });
    res.status(200).json(getTopic);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const updateTopic = async (req, res) => {
  try {
    const topicID = req.params.id;
    const update = await uni_topic.findByIdAndUpdate(
      topicID,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const topicID = req.params.id;
    const deleteTopic = await uni_topic.findByIdAndDelete(topicID);
    res.status(200).json({ status: "Topic deleted." });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};
