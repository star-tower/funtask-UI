import React, {ReactElement} from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Table,
    Tbody,
    Thead,
    useDisclosure
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {TagSelector} from "../components/TagSelector";
import {ApiService} from "../openapi";
import {useApiForm} from "../hooks/openapi";

const useCreateWorker = (): [() => void, ReactElement] => {
    const {register, handleSubmit, formState} = useApiForm();
    const {isOpen, onOpen, onClose} = useDisclosure();

    const createWorkerComponent = <Modal isCentered onClose={onClose} isOpen={isOpen} size='3xl'>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Create Worker</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <FormControl isRequired>
                    <FormLabel>Create Worker Number</FormLabel>
                    <NumberInput
                        min={1}
                        defaultValue={1}
                    >
                        <NumberInputField {...register('workerNumber')} />
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FormControl>
                    <FormLabel>New Worker Name</FormLabel>
                    <Input
                        {...register('workerName')}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Worker Tags</FormLabel>
                    <TagSelector namespace={'default'} type='WORKER'></TagSelector>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button isLoading={formState.isSubmitting} colorScheme='green' onClick={
                    handleSubmit(async (data) => {
                        await ApiService.increaseWorkerApiIncreaseWorkerPost({
                            name: data['workerName'],
                            number: data['workerNumber'],
                            tags: []
                        });
                        onClose();
                    })
                }>Create</Button>
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
                    <IconButton
                        aria-label='new worker'
                        size='sm'
                        icon={<AddIcon/>}
                        onClick={openCreateWorkerModal}
                    />
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
