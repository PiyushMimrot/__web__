
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,

    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Input,
    Select
} from '@chakra-ui/react';

import { SERVER } from '../../config';
import ChakraUiTable from '../ChakraUiTable/ChakraUiTable';

export const Achievement = () => {
    const [assignments, setAssignments] = useState([]);


    const keysToDisplay = [
        "GoesTo",
        "Achievement Type",
        "Event Name",
        "Description",

    ];
    const keysArray = [

        "goesTo",
        "achievementType",
        "eventName",
        "description"



    ];

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [Editdata, setEdit] = useState(null);
    const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

    useEffect(() => {
        fetchMaterials();
        Staffs()
        fetchstudents()
    }, []);
    const [Staff, SetStaffs] = useState([])
    const [Studetns, SetStudents] = useState([])
    const Staffs = async () => {
        try {
            const response = await axios.get(`${SERVER}/staffmanage/staff`); // Assuming your backend is running on the same domain
            SetStaffs(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    }


    const fetchstudents = () => {
        const stuendts = fetch(`${SERVER}/courseplatform/studentinformation`).then((r) => {
            return r.json()
        }).then((res) => {
            SetStudents(res)
        })

    }
    console.log(assignments)
    const fetchMaterials = async () => {
        try {
            const response = await axios.get(`${SERVER}/achievement/api/achievements`); // Assuming your backend is running on the same domain
            setAssignments(response.data)
            //(response)
        } catch (error) {
            console.error('Error fetching Achievement:', error);
        }
    };


    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setEdit((prevMaterial) => ({
            ...prevMaterial,
            [name]: value,
        }));
    };

    const handleEditFileInputChange = (event) => {
        const { name, files } = event.target;
        const file = files[0];
        setEdit((prevMaterial) => ({
            ...prevMaterial,
            [name]: file,
        }));
    };

    // Submit new edit form data 

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        //(Editdata, "line 104")
        let URL = `${SERVER}/achievement/api/achievements/${Editdata._id}`

        await fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Editdata),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the JSON response
            })
            .then((data) => {
                // Handle the successful response here
                //('Achievement updated successfully:', data);
                onEditModalClose();
                fetchMaterials();
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error updating Achievement:', error);
            });

    };

    // Delete a item by id 
    const handleDelete = async (id) => {

        try {
            await axios.delete(`${SERVER}/achievement/api/achievements/${id}`);
            fetchMaterials();
        } catch (error) {
            console.error('Error deleting Achievement:', error);
        }
        //(`Edit clicked for item with ID: ${id}`);

    };

    const [Assign, SetAssign] = useState()

    const [newMaterial, setNewMaterial] = useState({
        goesTo: Assign,
        achievementType: '',
        eventName: '',
        description: ''

    });
    console.log(newMaterial.goesTo)


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewMaterial((prevMaterial) => ({
            ...prevMaterial,
            [name]: value,
        }));
    };
    //(newMaterial)


    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(newMaterial)
        try {
            const formData = new FormData();
            for (const key in newMaterial) {
                formData.append(key, newMaterial[key]);
            }

            await axios.post(`${SERVER}/achievement/api/achievements`, newMaterial, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

            onClose(); // Close the modal after successful submission
            fetchMaterials();
        } catch (error) {
            console.error('Error creating material:', error);
        }
    }
    const handleFileInputChange = (event) => {
        const { name, files } = event.target;
        const file = files[0];
        setNewMaterial((prevMaterial) => ({
            ...prevMaterial,
            [name]: file,
        }));
    };
    const [goes, setgoes] = useState()

    return (
        <>
            <Box p={4}>
                <Text as="h1" fontSize="2xl" mb={4}>
                    Achievement List
                </Text>
                <Button mt={4} colorScheme="teal" onClick={onOpen}>
                    Add Achievement
                </Button>


                <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Edit AchievementT </ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleEditSubmit}>
                                <div>
                                    <label htmlFor="goesTo">goesTo</label>


                                    <Select value={Editdata?.goesTo || ''} name="goesTo" onChange={handleInputChange} placeholder='Select goesTo'>
                                        <option value='student'>student</option>
                                        <option value='teacher'>teacher</option>

                                    </Select>

                                </div>
                                <div>

                                    <label htmlFor="achievementType">achievementType</label>
                                    <Input
                                        type="text"
                                        name="achievementType"
                                        value={Editdata?.achievementType || ''}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="eventName">eventName</label>
                                    <Input
                                        type="text"
                                        name="eventName"
                                        value={Editdata?.eventName || ''}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description">description</label>
                                    <Input
                                        type="text"
                                        name="description"
                                        value={Editdata?.description || ''}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>


                                <Button type="submit" colorScheme="blue" mt={4}>
                                    Update  Achievement
                                </Button>
                            </form>
                        </ModalBody>
                    </ModalContent>
                </Modal>


                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add Achievement</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit}>

                                <div>
                                    <label htmlFor="goesTo">goesTo</label>

                                    <Select placeholder='Select goesTo'  onChange={(e)=>setgoes(e.target.value)}>
                                        <option value='student'>student</option>
                                        <option value='teacher'>teacher</option>

                                    </Select>
                                </div>

                                {
                                    goes && goes == "student" ? <div>
                                        <label htmlFor="studentId">studentId</label>

                                        <Select
                                            name="studentId"
                                            value={newMaterial.goesTo} onChange={handleInputChange}


                                            required
                                        >
                                            <option value="">Select a Student</option>
                                            {Studetns && Studetns.map(student => (
                                                <option key={student._id} value={student._id}>
                                                    {student.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div> : goes == "teacher" ? <div>
                                        <label htmlFor="teacherId">teacher Id</label>

                                        <Select
                                            name="teacherId"
                                            value={newMaterial.goesTo} onChange={handleInputChange}

                                            required
                                        >
                                            <option value="">Select a teacher</option>
                                            {Staff && Staff.map(student => (
                                                <option key={student._id} value={student._id}>
                                                    {student.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div> : null
                                }


                                <div>
                                    <label htmlFor="achievementType">achievementType</label>
                                    <Input
                                        type="text"
                                        name="achievementType" achievementType
                                        value={newMaterial.achievementType}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="eventName">eventName</label>
                                    <Input
                                        type="text"
                                        name="eventName"
                                        value={newMaterial.eventName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description">description</label>
                                    <Input
                                        type="text"
                                        name="description"
                                        value={newMaterial.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>


                                <Button type="submit" colorScheme="blue" mt={4}>
                                    Submit Achievement
                                </Button>
                            </form>

                        </ModalBody>
                    </ModalContent>
                </Modal>

                <ChakraUiTable handleDelete={handleDelete} assignments={assignments} keysToDisplay={keysToDisplay} keysArray={keysArray} setEdit={setEdit} isEditModalOpen={isEditModalOpen} onEditModalOpen={onEditModalOpen} onEditModalClose={onEditModalClose} />
            </Box >
        </>
    )
}
