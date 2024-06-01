import Calender from "../Model/CalenderModel.js";

export const addEvent = async (req, res) => {
  try {
    const event = await new Calender({
      ...req.body,
      school_id: req.school,
    }).save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEvent = async (req, res) => {
  try {
    const event = await Calender.find({ school_id: req.school });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventByDate = async (req, res) => {
  try {
    const event = await Calender.find({
      date: req.body.date,
      school_id: req.school,
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editEvent = async (req, res) => {
  try {
    const updatedEvent = req.body;

    const event = await Calender.findByIdAndUpdate(
      req.params.id,
      updatedEvent,
      {
        new: true,
      }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const deletedEvent = await Calender.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
