
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

function Universalmaterial() {
    const [assignments, setAssignments] = useState([]);
    const [selectV, setSelectV] = useState({});

    const keysToDisplay = [
        "Class",
        "Subject",
        "Chapter",
        "TOPIC",
        "SHORT DESCRIPTION",
        "DOCUMENT",
        "ACTIONS",
    ];
    const keysArray = [
        "class_id.class_name",
        "subject_id.name",
        "chapter",
        "topic",
        "short_desc",
        "doc_path"
    ];

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [Editdata, setEdit] = useState(null);
    const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
    const [classes, setClasses] = useState([]);
    const [subject, setSubject] = useState([]);


    //(assignments, "this is line number 147 ")
    useEffect(() => {
        fetchMaterials()
        fetchClass();
    }, []);

    useEffect(() => {
        if (selectV['class_id']) {
            fetchSubject()
        }
    }, [selectV]);

    // console.log(subject)

    const fetchClass = async () => {
        try {
            const response = await axios.get(`${SERVER}/classes`);
            setClasses(response.data)
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    }

    const fetchSubject = async () => {
        // console.log(selectV.class_id);
        try {
            const response = await axios.get(`${SERVER}/subject/getSubjectClass/${selectV.class_id}`);
            setSubject(response.data.data)
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }

    const fetchMaterials = async () => {
        try {
            const response = await axios.get(`${SERVER}/universeMaterials/materials`);
            setAssignments(response.data)
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };


    const handleDownload = async (material) => {
        // console.log(material)
        try {
            const response = await axios.get(`${SERVER}/universeMaterials/download/${material}`, {
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
        let URL = `${SERVER}/universeMaterials/materials/${Editdata._id}`

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
                //('Material updated successfully:', data);
                onEditModalClose();
                fetchMaterials();
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error updating material:', error);
            });

    };

    // Delete a item by id 
    const handleDelete = async (id) => {

        try {
            await axios.delete(`${SERVER}/universeMaterials/materials/${id}`);
            fetchMaterials();
        } catch (error) {
            console.error('Error deleting material:', error);
        }


    };


    const [newMaterial, setNewMaterial] = useState({
        topic: '',
        short_desc: '',
        date: '',
        doc_path: '',
        chapter:''
    });
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
        try {
            const formData = new FormData();
            let newMaterialData = {...newMaterial,...selectV};
            console.log(newMaterialData,'nm');
            for (const key in newMaterialData) {
                formData.append(key, newMaterialData[key]);
            }

            // console.log(formData,'fd');

            await axios.post(`${SERVER}/universeMaterials/materials/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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

    const handleChange = (e) => {
        selectV[e.target.name] = e.target.value;
        setSelectV({ ...selectV });
    }

    return (
        <Box p={4}>
            <Text as="h1" fontSize="2xl" mb={4}>
                Support Material
            </Text>
            <Button mt={4} colorScheme="teal" onClick={onOpen}>
                Add Universal material
            </Button>
            <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Universal material</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleEditSubmit}>
                            <div>
                                <label htmlFor="topic">topic</label>
                                <Input
                                    type="text"
                                    name="topic"
                                    value={Editdata?.topic || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="short_desc">short_desc</label>
                                <Input
                                    type="text"
                                    name="short_desc"
                                    value={Editdata?.short_desc || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="date">date</label>
                                <Input
                                    type="date"
                                    name="date"
                                    value={Editdata?.date || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="status">status</label>
                                <Input
                                    type="text"
                                    name="status"
                                    value={Editdata?.status || ''}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="doc_path">Document Path</label>
                                <Input
                                    type="file"
                                    name="doc_path"
                                    accept=""
                                    onChange={handleEditFileInputChange}
                                />
                            </div>

                            <Button type="submit" colorScheme="blue" mt={4}>
                                Update Assignments
                            </Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Universal material</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <div className='row'>
                                <div className='col'>
                                    <label htmlFor="topic">Select Class</label>
                                    <Select placeholder='Select option' onChange={handleChange} name='class_id'>
                                        {
                                            classes.map((item, idx) => {
                                                return <option value={item._id} key={idx}>{item.class_name}</option>
                                            })
                                        }
                                    </Select>
                                </div>
                                <div className='col'>
                                    <label htmlFor="topic">Select Subject</label>
                                    <Select placeholder='Select option' onChange={handleChange} name='subject_id'>
                                        {
                                            subject.map((item, idx) => {
                                                return <option value={item._id} key={idx}>{item.name}</option>
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col'>
                                    <label htmlFor="topic">Chapter Name</label>
                                    <Input
                                        type="text"
                                        name="chapter"
                                        value={newMaterial.chapter}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className='col'>
                                    <label htmlFor="topic">Topic</label>
                                    <Input
                                        type="text"
                                        name="topic"
                                        value={newMaterial.topic}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="short_desc">Description</label>
                                <Input
                                    type="text"
                                    name="short_desc"
                                    value={newMaterial.short_desc}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="date">Date</label>
                                <Input
                                    type="date"
                                    name="date"
                                    value={newMaterial.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="doc_path">Document Path</label>
                                <Input
                                    type="file"
                                    accept=""
                                    name="doc_path"
                                    onChange={handleFileInputChange}
                                />

                            </div>

                            <Button type="submit" colorScheme="blue" mt={4}>
                                Submit Universal material
                            </Button>
                        </form>

                    </ModalBody>
                </ModalContent>
            </Modal>

            <ChakraUiTable assignments={assignments} keysToDisplay={keysToDisplay} keysArray={keysArray} setEdit={setEdit} handleDownload={handleDownload} handleDelete={handleDelete} isEditModalOpen={isEditModalOpen} onEditModalOpen={onEditModalOpen} onEditModalClose={onEditModalClose} />
        </Box >
    );
}

export default Universalmaterial;
