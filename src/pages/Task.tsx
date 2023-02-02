import React, {ReactElement, useEffect} from "react";
import {
    Box, Button,
    Card,
    CardBody,
    CardHeader, FormControl, FormLabel,
    Heading,
    IconButton, Input,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import Editor from "@monaco-editor/react";

const useCreateTask = (): [() => void, ReactElement] => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const createTaskComponent = <Modal isCentered isOpen={isOpen} onClose={onClose} size='3xl'>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Create Task</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <FormControl>
                    <FormLabel>Func Body</FormLabel>
                    <Editor
                        height='20vh'
                        language='python'
                        theme='vs-dark'
                        defaultValue={"def fun(state, logger):\n    ...\n"}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Worker Name</FormLabel>
                    <Input/>
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
    return [onOpen, createTaskComponent];
}

export const Task: React.FC = () => {
    const [openCreateTaskModal, createTaskModal] = useCreateTask();
    return <>
        {createTaskModal}
        <Box p={5}>
            <Card>
                <CardHeader>
                    <Heading size='md'>Task</Heading>
                </CardHeader>
                <CardBody>
                    <IconButton onClick={openCreateTaskModal} aria-label='new task' size='sm' icon={<AddIcon/>}/>
                </CardBody>
            </Card>
        </Box>
    </>;
}