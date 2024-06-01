import express from 'express';
import TutionFees from '../Model/TutionFees.Model.js';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const TutionFeesData = req.body;
    const TUtionFeeD = new TutionFees(TutionFeesData);
    const result = await TUtionFeeD.save();
    res.status(201).json(result);
    //(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const fees = await TutionFees.find();
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const FeesStructureId = req.params.id;
  const updatedTutionFeesData = req.body;
  //(updatedTutionFeesData);

  try {
    const updatedTutionFees = await TutionFees.findByIdAndUpdate(
      FeesStructureId,
      updatedTutionFeesData,
      { new: true }
    );
    if (!updatedTutionFees) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(updatedFeesStructureM);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  const FeesStructureId = req.params.id;

  try {
    const deletedFeesStructure = await FeesStructureM.findByIdAndRemove(FeesStructureId);

    if (!deletedFeesStructure) {
      return res.status(404).json({ error: ' Not found' });
    }

    res.json({ message: ' deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;














//post {
//     "class":"10",
//     "noOfSec":"2",
//     "class_id":1234,
//     "section":[
//         {
//             "section_id":"12ab",
//             "class_id":"1234",
//             "section_name":"A",
//             "sec_teacher_id":"abc124"
//         },
//         {
//             "section_id":"12ac",
//             "class_id":"1234",
//             "section_name":"B",
//             "sec_teacher_id":"abc125"
//         }
//     ]
// }