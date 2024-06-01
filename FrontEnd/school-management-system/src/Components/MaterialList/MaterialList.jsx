
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Center,
    Select,
} from '@chakra-ui/react';
import { NavLink } from "react-router-dom"
import { SERVER } from '../../config';

function MaterialList() {
    const [materials, setMaterials] = useState([]);
    const [newMaterial, setNewMaterial] = useState({
        short_desc: '',
        subject_id: '',
        course_id: '',
        doc_path: null,
        staff_id: '',
        class_id: '',
        date: '',
        status: '',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editMaterial, setEditMaterial] = useState(null);
    const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

    useEffect(() => {
        fetchMaterials();
        Classes()
        Staffs()
        Coursees()
        Subjects()
    }, []);

    const [Class, SetClass] = useState([])
    const [Staff, SetStaffs] = useState([])
    const [Course, SetCourse] = useState([])
    const [Subject, SetSubjects] = useState([])


    const Classes = async () => {
        try {
            const response = await axios.get(`${SERVER}/classes`); // Assuming your backend is running on the same domain
            SetClass(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    }

    const Staffs = async () => {
        try {
            const response = await axios.get(`${SERVER}/staffmanage/staff`); // Assuming your backend is running on the same domain
            SetStaffs(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    }
    const Coursees = async () => {
        try {
            const response = await axios.get(`${SERVER}/course/getCourse`); // Assuming your backend is running on the same domain
            SetCourse(response.data.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    }

    const Subjects = async () => {
        try {
            const response = await axios.get(`${SERVER}/subject/getSubject`); // Assuming your backend is running on the same domain
            SetSubjects(response.data.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    }


    const fetchMaterials = async () => {
        try {
            const response = await axios.get(`${SERVER}/materiallist`); // Assuming your backend is running on the same domain
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewMaterial((prevMaterial) => ({
            ...prevMaterial,
            [name]: value,
        }));
    };

    const handleFileInputChange = (event) => {
        const { name, files } = event.target;
        const file = files[0];
        setNewMaterial((prevMaterial) => ({
            ...prevMaterial,
            [name]: file, // Store the file object in the state
        }));
    };
    console.log(materials)
    const handleSubmit = async (event) => {
        console.log(newMaterial)
        event.preventDefault();
        try {
            const formData = new FormData();
            for (const key in newMaterial) {
                formData.append(key, newMaterial[key]);
            }

            await axios.post(`${SERVER}/materiallist`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            onClose(); // Close the modal after successful submission
            fetchMaterials();
        } catch (error) {
            console.error('Error creating material:', error);
        }
    };

    const handleDownload = async (material) => {
        try {
            const response = await axios.get(`${SERVER}/materiallist/download/${material.doc_path}`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = material.doc_path;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading document:', error);
        }
    };

    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setEditMaterial((prevMaterial) => ({
            ...prevMaterial,
            [name]: value,
        }));
    };

    const handleEditFileInputChange = (event) => {
        const { name, files } = event.target;
        const file = files[0];
        setEditMaterial((prevMaterial) => ({
            ...prevMaterial,
            [name]: file,
        }));
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        //(editMaterial)
        let URL = `${SERVER}/materiallist/${editMaterial._id}`

        await fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editMaterial),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the JSON response
            })
            .then((data) => {
                // Handle the successful response here
                //('Material updated successfully:', data);
                onEditModalClose();
                fetchMaterials();
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error updating material:', error);
            });

    };

    const handleDeleteClick = async (materialId) => {
        //(materialId)
        try {
            await axios.delete(`${SERVER}/materiallist/${materialId}`);
            fetchMaterials();
        } catch (error) {
            console.error('Error deleting material:', error);
        }
    };

    return (
        <Box p={4}>
            <Text as="h1" fontSize="2xl" mb={4}>
                Material List
            </Text>
            <Button mt={4} colorScheme="teal" onClick={onOpen}>
                Add Material
            </Button>


            <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Material</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleEditSubmit}>
                            <div>
                                <label htmlFor="short_desc">Short Description</label>
                                <Input
                                    type="text"
                                    name="short_desc"
                                    value={editMaterial?.short_desc || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="subject_id">Subject ID</label>
                                <Input
                                    type="text"
                                    name="subject_id"
                                    value={editMaterial?.subject_id || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="course_id">Course ID</label>
                                <Input
                                    type="text"
                                    name="course_id"
                                    value={editMaterial?.course_id || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="doc_path">Document Path</label>
                                <Input
                                    type="file"
                                    name="doc_path"
                                    onChange={handleEditFileInputChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="staff_id">Staff ID</label>
                                <Input
                                    type="text"
                                    name="staff_id"
                                    value={editMaterial?.staff_id || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="class_id">Class ID</label>
                                <Input
                                    type="text"
                                    name="class_id"
                                    value={editMaterial?.class_id || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="date">Date</label>
                                <Input
                                    type="date"
                                    name="date"
                                    value={editMaterial?.date || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="status">Status</label>
                                <Input
                                    type="text"
                                    name="status"
                                    value={editMaterial?.status || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <Button type="submit" colorScheme="blue" mt={4}>
                                Update Material
                            </Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>


            {/* Modal for adding materials */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Material</ModalHeader>
                    <ModalBody>

                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align="start">
                                <FormControl>
                                    <FormLabel htmlFor="short_desc">Short Description</FormLabel>
                                    <Input
                                        type="text"
                                        name="short_desc"
                                        value={newMaterial.short_desc}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="subject_id">Subject ID</FormLabel>
                                    <Select
                                        id="subject_id"
                                        name="subject_id"
                                        value={newMaterial.subject_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a Subject</option>
                                        {Subject && Subject.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="course_id">Course ID</FormLabel>
                                    <Select
                                        id="course_id"
                                        name="course_id"
                                        value={newMaterial.course_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a Course</option>
                                        {Course && Course.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="doc_path">Document Path</FormLabel>
                                    <Input
                                        type="file"
                                        name="doc_path"
                                        accept=""
                                        onChange={handleFileInputChange}
                                        required
                                    />
                                    {newMaterial.doc_path && (
                                        <Box>
                                            <Text fontSize="lg">Preview:</Text>
                                            {newMaterial.doc_path.type.startsWith("image/") ? (
                                                <Box>
                                                    <img
                                                        src={URL.createObjectURL(newMaterial.doc_path)}
                                                        alt="Uploaded Image"
                                                        style={{ maxWidth: "100%" }}
                                                    />
                                                </Box>
                                            ) : newMaterial.doc_path.type.startsWith("video/") ? (
                                                <Box>
                                                    <video controls style={{ maxWidth: "100%" }}>
                                                        <source
                                                            src={URL.createObjectURL(newMaterial.doc_path)}
                                                        />
                                                    </video>
                                                </Box>
                                            ) : (
                                                <Text>File type not supported for preview.</Text>
                                            )}
                                        </Box>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="staff_id">Staff ID</FormLabel>
                                    <Select
                                        id="staff_id"
                                        name="staff_id"
                                        value={newMaterial.staff_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a Staff</option>
                                        {Staff && Staff.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="class_id">Class ID</FormLabel>

                                    <Select
                                        id="class_id"
                                        name="class_id"
                                        value={newMaterial.class_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a Class</option>
                                        {Class && Class.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.class_name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="date">Date</FormLabel>
                                    <Input
                                        type="date"
                                        name="date"
                                        value={newMaterial.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="status">Status</FormLabel>
                                    <Input
                                        type="text"
                                        name="status"
                                        value={newMaterial.status}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormControl>
                                <Center>
                                    <Button type="submit">Add Material</Button>
                                </Center>
                            </VStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Text as="h2" fontSize="xl" mt={8} mb={4}>
                Material List
            </Text>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Short Description</Th>
                        <Th>Subject ID</Th>
                        <Th>Course ID</Th>
                        <Th>Document Path</Th>
                        <Th>Staff ID</Th>
                        <Th>Class ID</Th>
                        <Th>Date</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {materials.map((material) => (
                        <Tr key={material._id}>
                            <Td>{material.short_desc}</Td>
                            <Td>{material?.subject_id?.name}</Td>
                            <Td>{material.course_id?.name}</Td>
                            <Td>
                                <NavLink to={`/studyitem/${material._id}`} rel="noopener noreferrer">
                                    View
                                </NavLink>
                            </Td>
                            <Td>{material.staff_id.name}</Td>
                            <Td>{material.class_id.class_name}</Td>
                            <Td>{material.date}</Td>
                            <Td>{material.status}</Td>
                            <Td>
                                <Button onClick={() => handleDownload(material)}>Download</Button>
                            </Td>
                            <Td style={{ display: "flex" }}>

                                <Button ml={2} colorScheme="teal" onClick={() => {
                                    setEditMaterial(material); // Set the material to be edited
                                    onEditModalOpen(); // Open the Edit Material modal
                                }}>
                                    Edit
                                </Button>
                                <Button
                                    ml={2}
                                    colorScheme="red"
                                    onClick={() => handleDeleteClick(material._id)}
                                >
                                    Delete
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box >
    );
}

export default MaterialList;
