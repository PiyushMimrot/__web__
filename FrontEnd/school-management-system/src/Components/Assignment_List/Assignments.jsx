import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";
import EditAssignmentModal from "./EditAssignmentModal";
import { CreateAssignment } from "./CreateAssignment";
import { SERVER } from "../config";
// EditAssignmentModal
const AssignmentTable = () => {
  const [assignments, setAssignments] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  var storedAssignment = localStorage.getItem("editedAssignment");
  // Function to fetch assignments from the backend
  let data = JSON.parse(storedAssignment);
  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${SERVER}/assignments`);
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  console.log(assignments);

  // Fetch assignments when the component mounts
  useEffect(() => {
    fetchAssignments();
  }, []);
  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (editedAssignment) => {
    try {
      await axios.put(
        `${SERVER}/assignments/${data && data.id}`,
        editedAssignment
      );
      fetchAssignments();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  const handleDelete = async (assignmentId) => {
    // Implement delete functionality here
    try {
      await axios.delete(`${SERVER}/assignments/${assignmentId}`);
      fetchAssignments(); // Fetch assignments again after deletion
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  console.log(assignments);
  return (
    <>
      <CreateAssignment />
      <Box style={{ minHeight: "100vh" }}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Topic</Th>
              <Th>Description</Th>
              <Th>Subject</Th>
              <Th>Class</Th>
              <Th>Section</Th>
              <Th>Staff Name</Th>
              <Th>Last Date</Th>
              <Th>Status</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assignments.map((assignment, idx) => (
              <Tr key={idx}>
                <Td>{assignment.topic}</Td>
                <Td>{assignment.desc}</Td>
                <Td>{assignment.subject_id}</Td>
                <Td>{assignment.class_id}</Td>
                <Td>{assignment.section_id}</Td>
                <Td>{assignment.staff_id}</Td>
                <Td>{new Date(assignment.last_date).toLocaleDateString()}</Td>
                <Td>{assignment.status}</Td>
                <Td>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => {
                      // Store assignment data in local storage
                      localStorage.setItem(
                        "editedAssignment",
                        JSON.stringify({
                          id: assignment._id,
                          topic: assignment.topic,
                          desc: assignment.desc,
                          subject_id: assignment.subject_id,
                          class_id: assignment.class_id,
                          section_id: assignment.section_id,
                          staff_id: assignment.staff_id,
                          last_date: new Date(
                            assignment.last_date
                          ).toLocaleDateString(),
                          status: assignment.status,
                        })
                      );

                      handleEdit();
                    }}
                  >
                    Edit
                  </Button>
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(assignment._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <EditAssignmentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          assignment={selectedAssignment}
          onUpdate={handleUpdate}
        />
      </Box>
    </>
  );
};

export default AssignmentTable;
