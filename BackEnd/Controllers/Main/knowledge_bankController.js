import knowledge_bank from "../../Model/Main/knowledge_bankModel.js";

export const addKnowledgeBank = async (req, res) => {
  try {
    const material = req.file ? req.file.filename : undefined;

    const newBank = new knowledge_bank({ ...req.body, material });

    const savedNewBank = await newBank.save();
    res.status(201).json(savedNewBank);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const addKnowledgeBankExcel = async (req, res) => {
  try {
    const result = await knowledge_bank.insertMany(req.body);

    res.status(201).json({
      message: "Documents inserted successfully",
      success: true,
      insertedIds: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error inserting documents", success: false });
  }
};

export const getBankByTopic = async (req, res) => {
  try {
    const topicID = req.params.id;
    const getBank = await knowledge_bank
      .find({ topic_id: topicID })
      .populate("topic_id", "topic_name");
    res.status(200).json(getBank);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const updateBank = async (req, res) => {
  try {
    const bankID = req.params.id;
    const update = await knowledge_bank.findByIdAndUpdate(
      bankID,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const deleteBank = async (req, res) => {
  try {
    const bankID = req.params.id;
    await knowledge_bank.findByIdAndDelete(bankID);
    res.status(200).json({ status: "Knowledge bank deleted." });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};
