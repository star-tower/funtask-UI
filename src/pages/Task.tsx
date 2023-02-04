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
import {encode as base64_encode} from 'base-64';
import {Worker as WorkerComponent} from "../components/Worker"
import {AddIcon, SearchIcon} from "@chakra-ui/icons";
import Editor from "@monaco-editor/react";
import {useApiForm} from "../hooks/openapi";
import {ApiService, Worker} from "../openapi";

const useCreateTask = (): [() => void, ReactElement] => {
    const {register, handleSubmit, formState} = useApiForm();
    const [workerSearchValue, setWorkerSearchValue] = useState("");
    const [matchedWorkers, setMatchedWorkers] = useState<Worker[]>([]);
    const [currentWorkerSelections, setCurrentWorkerSelections] = useState<Worker[]>([]);

    const [editorValue, setEditorValue] = useState<string | undefined>("def fun(state, logger):\n    ...\n");
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
                        onChange={(value => setEditorValue(value))}
                        value={editorValue}
                        height='20vh'
                        language='python'
                        theme='vs-dark'
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Worker Name</FormLabel>
                    <InputGroup>
                        <InputLeftElement children={
                            <Menu>
                                <MenuButton onClick={async () => {
                                    const resp = await ApiService.getWorkersApiWorkersGet(
                                        10,
                                        undefined,
                                        workerSearchValue
                                    );
                                    setMatchedWorkers(resp.workers);
                                }
                                }>
                                    <IconButton
                                        aria-label={'search'}
                                        size='es'
                                        icon={<SearchIcon/>}
                                    />
                                </MenuButton>
                                <MenuList>
                                    {matchedWorkers.length === 0 ? <Text color='grey'>empty</Text> : <></>}
                                    {matchedWorkers.map(
                                        (worker, i) => <MenuItem
                                            key={i}
                                            onClick={() => {setCurrentWorkerSelections(
                                                prevState => [...prevState, worker]
                                            )}}
                                        >
                                            <WorkerComponent worker={worker}/>
                                        </MenuItem>
                                    )}
                                </MenuList>
                            </Menu>
                        }/>
                        <Input onChange={(e) => setWorkerSearchValue(e.target.value)} value={workerSearchValue}/>
                    </InputGroup>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button isLoading={formState.isSubmitting} onClick={
                    handleSubmit(async () => {
                        await ApiService.triggerFuncApiFuncInstancePost({
                            timeout: 1,
                            dependencies: [],
                            description: "",
                            func_description: "",
                            change_state: false,
                            func_base64: base64_encode(editorValue ?? ""),
                            worker_uuids: currentWorkerSelections.map(worker => worker.uuid)
                        });
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