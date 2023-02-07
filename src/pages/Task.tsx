import React, {ReactElement, useState} from "react";
import {
    Box, Button,
    Card,
    CardBody,
    CardHeader, FormControl, FormLabel,
    Heading,
    IconButton, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Text,
    useDisclosure
} from "@chakra-ui/react";
import {Worker as WorkerComponent} from "../components/Worker"
import {AddIcon, SearchIcon} from "@chakra-ui/icons";
import {useApiForm} from "../hooks/openapi";
import {ApiService, Func, Worker} from "../openapi";
import {FunctionSelector} from "../components/FunctionSelector";
import {WorkerSelector} from "../components/WorkerSelector";

const useCreateTask = (): [() => void, ReactElement] => {
    const {register, handleSubmit, formState} = useApiForm();
    const [currentWorkerSelections, setCurrentWorkerSelections] = useState<Worker[]>([]);

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedFunc, setSelectedFunc] = useState<Func | undefined>(undefined);

    const createTaskComponent = <Modal isCentered isOpen={isOpen} onClose={onClose} size='3xl'>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Create Task</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <WorkerSelector onWorkerChange={setCurrentWorkerSelections}/>
                <FunctionSelector onChange={value => setSelectedFunc(value[0])}/>
            </ModalBody>
            <ModalFooter>
                <Button mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button isLoading={formState.isSubmitting} onClick={
                    handleSubmit(async () => {
                        if (selectedFunc !== undefined) {
                            await ApiService.createTaskApiTaskPost({
                                timeout: 1,
                                dependencies: [],
                                description: "",
                                func_uuid: selectedFunc.uuid,
                                change_state: false,
                                worker_uuids: currentWorkerSelections.map(worker => worker.uuid)
                            });
                        }
                    })
                } colorScheme='green'>Create</Button>
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