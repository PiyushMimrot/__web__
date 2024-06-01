import { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
} from '@chakra-ui/react';

const EditAssignmentModal = ({ isOpen, onClose, onUpdate }) => {
    const [editedAssignment, setEditedAssignment] = useState({
        id: '',
        topic: '',
        desc: '',
        subject_id: '',
        class_id: '',
        section_id: '',
        staff_id: '',
        last_date: '',
        status: 'active',
    });
    
    var storedAssignment = localStorage.getItem('editedAssignment');
    useEffect(() => {
        // Retrieve data from local storage when the modal opens
        if (storedAssignment) {
            setEditedAssignment(JSON.parse(storedAssignment));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedAssignment({ ...editedAssignment, [name]: value });
    };

    const handleSubmit = () => {
        onUpdate(editedAssignment);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Assignment</ModalHeader>
                {storedAssignment && <ModalBody>
                    <FormControl>
                        <FormLabel>Topic</FormLabel>
                        <Input
                            type="text"
                            name="topic"
                            value={editedAssignment.topic}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            name="desc"
                            value={editedAssignment.desc}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Subject ID</FormLabel>
                        <Input
                            type="text"
                            name="subject_id"
                            value={editedAssignment.subject_id}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Class ID</FormLabel>
                        <Input
                            type="text"
                            name="class_id"
                            value={editedAssignment.class_id}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Section ID</FormLabel>
                        <Input
                            type="text"
                            name="section_id"
                            value={editedAssignment.section_id}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Staff ID</FormLabel>
                        <Input
                            type="text"
                            name="staff_id"
                            value={editedAssignment.staff_id}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Last Date</FormLabel>
                        <Input
                            type="date"
                            name="last_date"
                            value={editedAssignment.last_date}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select
                            name="status"
                            value={editedAssignment.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="nonactive">Non-Active</option>
                        </Select>
                    </FormControl>
                </ModalBody>}
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditAssignmentModal;