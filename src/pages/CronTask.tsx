import React, {ReactElement} from "react";
import {
    Box, Button,
    Card,
    CardBody,
    CardHeader, FormControl, FormLabel,
    Heading,
    IconButton, InputGroup,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {useApiForm} from "../hooks/openapi";


const useCreateCronTask = (): [() => void, ReactElement] => {
    const {register, handleSubmit, formState} = useApiForm();
    const {isOpen, onOpen, onClose} = useDisclosure();

    const createCronTaskModal = <Modal isCentered isOpen={isOpen} onClose={onClose} size='3xl'>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Create Cron Task</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <FormControl>
                    <FormLabel>Cron Task Name</FormLabel>
                    <InputGroup>

                    </InputGroup>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button mr={3} onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>;
    return [onOpen, createCronTaskModal];
}

export const CronTask: React.FC = () => {
    const [openCreateTaskCronTask, createCronTaskModal] = useCreateCronTask();
    return <>
        {createCronTaskModal}
        <Box p={5}>
            <Card>
                <CardHeader>
                    <Heading size='md'>Cron Task</Heading>
                </CardHeader>
                <CardBody>
                    <IconButton onClick={openCreateTaskCronTask} aria-label='new cron task' size='sm' icon={<AddIcon/>}/>
                </CardBody>
            </Card>
        </Box>
    </>
}
