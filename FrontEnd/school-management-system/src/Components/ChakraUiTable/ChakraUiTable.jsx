
import { memo } from 'react';
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react';


function ChakraUiTable({ assignments, keysArray, keysToDisplay, setEdit, handleDownload, isEditModalOpen, onEditModalOpen, onEditModalClose, handleDelete }) {


    // console.log(assignments)

    return (
        <Box p={4}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        {keysToDisplay?.map((key) => (
                            <Th key={key}>{key}</Th>
                        ))}

                    </Tr>
                </Thead>
                <Tbody>
                    {assignments?.map((material) => (
                        <Tr key={material._id}>
                            {keysArray.map((key) => {

                                const fieldValue = key.split('.').reduce((obj, key) => obj?.[key], material);
                                console.log(fieldValue);
                                return (
                                <Td key={fieldValue}>{fieldValue}</Td>
                                )
                                })}
                            <Td>
                                <Button
                                    colorScheme="teal"
                                    size="sm"


                                    onClick={() => {
                                        setEdit(material); // Set the material to be edited
                                        onEditModalOpen(); // Open the Edit Material modal
                                    }}
                                >
                                    Edit
                                </Button>

                                <Button
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => handleDelete(material._id)}
                                >
                                    Delete
                                </Button>
                                {handleDownload && handleDownload ? <Button
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => handleDownload(material.documentPath ? material.documentPath : material.attachDocument ? material.doc_path : material.doc_path)}
                                >
                                    Download
                                </Button> : null}

                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box >
    );
}

export default memo(ChakraUiTable);