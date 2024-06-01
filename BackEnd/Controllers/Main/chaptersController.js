import uni_Chapters from "../../Model/Main/uni_chaptersModel.js";
import uni_topics from "../../Model/Main/uni_topicsModel.js";

export const addChapters = async (req, res) => {
  try {
    const newChapter = new uni_Chapters(req.body);
    const savedChapter = await newChapter.save();
    res.status(200).json(savedChapter);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const addManyChapters = async (req, res) => {
  try {
    const insertedChapters = await uni_Chapters.insertMany(req.body);
    res.status(201).json(insertedChapters);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const addManyChaptersExcel = async (req, res) => {
  try {
    const data = req.body.excelData;

    const chapters = {}; // Store chapters to avoid duplicates
    const topicDocs = [];

    for (const chapterData of data) {
      const chapterName = Object.keys(chapterData)[0];
      const topics = chapterData[chapterName];

      // Check if chapter already exists
      if (!chapters[chapterName]) {
        chapters[chapterName] = true; // Mark chapter as seen

        // Create and save new chapter
        const chapter = new uni_Chapters({
          chapter_name: chapterName,
          subject_id: req.body.subjectId,
        });
        const savedChapter = await chapter.save();
        const chapterId = savedChapter._id;

        // Create topic documents with chapterId reference
        topicDocs.push(
          ...topics.map((topic) => ({
            topic_name: topic,
            chapter_id: chapterId,
          }))
        );
      }
    }
    // Save all topics in bulk (if any)
    if (topicDocs.length) {
      await uni_topics.insertMany(topicDocs);
    }

    res.status(200).json({
      success: true,
      message: "Chapter and topics saved successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving data!" });
  }
};

export const getOneChapter = async (req, res) => {
  try {
    const id = req.params.id;
    const chapter = await uni_Chapters.findById(id);
    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const getChaptBySub = async (req, res) => {
  try {
    const subjectID = req.params.id;
    const getChapt = await uni_Chapters.find({ subject_id: subjectID });
    res.status(200).json(getChapt);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const updateChapt = async (req, res) => {
  try {
    const chaptID = req.params.id;
    const update = await uni_Chapters.findByIdAndUpdate(
      chaptID,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const deleteChapt = async (req, res) => {
  try {
    const chaptID = req.params.id;
    await uni_Chapters.findByIdAndDelete(chaptID);
    res.status(200).json({ status: "Chapter deleted." });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};
