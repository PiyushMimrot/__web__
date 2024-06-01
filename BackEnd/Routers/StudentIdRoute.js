import express from "express";
import Authorization from "../src/auth/Authorization.js"
import Students from "../src/models/student.js";

const router = express.Router();

// router.post(
//     "/student/",
//     //   Authorization(["admin", "teacher"]),
//     async (req, res) => {
//         // try {
//             const name = req.body;
//               console.log(name);

//                     // const student = Students.findOne({studentId})

//         //     if (!student) {
//         //         return res.status(404).json({ error: 'Student not found' });
//         //     }
//         //     res.json(student);
//         // } catch (error) {
//         //     res.status(401).json({
//         //         success: false,
//         //         message: "Internal error",
//         //         err: error.message,
//         //     });


// }

// );

router.get(
    "/student/:id",
    Authorization(["admin", "teacher"]),
      async (req, res) => {
        try {
            const id = req.params.id;
            console.log(id)
            const student = await Students.findOne({studentId:id});
            console.log(student)
            if (!student) {
                return res.status(404).json({ success: false, message: "Student not found" });
            }
  
        res.status(200).json({ success :true,student});
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
            console.log(error)
        }
    }
)
export default router;