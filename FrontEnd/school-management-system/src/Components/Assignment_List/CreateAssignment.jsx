import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Textarea, useDisclosure } from "@chakra-ui/react"
import axios from "axios";
import { useState } from "react";
import { SERVER } from '../config';
export function CreateAssignment() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [assignmentData, setAssignmentData] = useState({
    topic: '',
    desc: '',
    subject_id: '',
    class_id: '',
    section_id: '',
    staff_id: '',
    last_date: '',
    status: 'active', // Default value
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData({ ...assignmentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your backend API
      const response = await axios.post(`${SERVER}/assignments`, assignmentData);

      // Handle the response, e.g., show a success message or redirect
      //('Assignment created:', response.data);

      // Optionally, you can reset the form data after a successful submission
      setAssignmentData({
        topic: '',
        desc: '',
        subject_id: '',
        class_id: '',
        section_id: '',
        staff_id: '',
        last_date: '',
        status: 'active',
      });
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error('Error creating assignment:', error);
    }
  };
  return (
    <>
      <Button onClick={onOpen}>Create Assignment</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>

              <FormLabel>Topic</FormLabel>
              <Input placeholder='Topic'
                type="text"
                name="topic"
                value={assignmentData.topic}
                onChange={handleChange}


              />

              <FormLabel>Description</FormLabel>
              <Textarea
                name="desc"
                value={assignmentData.desc}
                onChange={handleChange}
                placeholder='Description'
              />


              <FormLabel>Subject ID</FormLabel>
              <Input
                type="number"
                name="subject_id"
                placeholder="subject_id"
                value={assignmentData.subject_id}
                onChange={handleChange}
              />
              <FormLabel>Class ID</FormLabel>
              <Input
                type="number"
                name="class_id"
                placeholder="class_id"
                value={assignmentData.class_id}
                onChange={handleChange}
              />
              <FormLabel>Section ID</FormLabel>
              <Input
                type="number"
                name="section_id"
                value={assignmentData.section_id}
                onChange={handleChange}

              />
              <FormLabel>Staff ID</FormLabel>
              <Input
                type="number"
                name="staff_id"
                value={assignmentData.staff_id}
                onChange={handleChange}

              />
              <FormLabel>Last Date</FormLabel>
              <Input
                type="date"
                name="last_date"
                value={assignmentData.last_date}
                onChange={handleChange}
              />
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={assignmentData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="nonactive">Non-Active</option>
              </Select>
              <Button mt="4" colorScheme="blue" onClick={handleSubmit}>
                Create Assignment
              </Button>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal >
    </>
  )
}