import React, {ReactElement, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    IconButton, Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput, NumberInputField, NumberInputStepper,
    useDisclosure
} from "@chakra-ui/react";
import {Table, Thead, Tbody} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {TagSelector} from "../components/TagSelector";

const useCreateWorker = (): [() => void, ReactElement] => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const [workerNumber, setWorkerNumber] = useState(1);
    const [workerName, setWorkerName] = useState<string | undefined>(undefined);

    const createWorkerComponent = <Modal isCentered onClose={onClose} isOpen={isOpen} size='3xl'>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Create Worker</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <FormControl isRequired>
                    <FormLabel>Create Worker Number</FormLabel>
                    <NumberInput
                        value={workerNumber}
                        onChange={(value) => setWorkerNumber(Number.parseInt(value))}
                        min={1}
                        defaultValue={1}
                    >
                        <NumberInputField/>
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FormControl>
                    <FormLabel>New Worker Name</FormLabel>
                    <Input
                        value={workerName || ''}
                        onChange={(value) => setWorkerName(value.target.value || undefined)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Worker Tags</FormLabel>
                    <TagSelector></TagSelector>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button colorScheme='green'>Create</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>;

    return [onOpen, createWorkerComponent]
}

export const Worker: React.FC = () => {
    const [openCreateWorkerModal, createWorkerModal] = useCreateWorker();
    return <>
        {createWorkerModal}
        <Box p={5}>
            <Card>
                <CardHeader>
                    <Heading size='md'>Worker</Heading>
                </CardHeader>
                <CardBody>
                    <Menu>
                        <MenuButton>
                            <IconButton
                                aria-label='new worker'
                                size='sm'
                                icon={<AddIcon/>}
                            />
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={openCreateWorkerModal}>add worker</MenuItem>
                        </MenuList>
                    </Menu>
                </CardBody>
                <Table>
                    <Thead>

                    </Thead>
                    <Tbody>

                    </Tbody>
                </Table>
            </Card>
        </Box>
    </>
}
