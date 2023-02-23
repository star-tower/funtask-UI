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
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {useApiForm} from "../hooks/openapi";
import {WorkerSelector} from "../components/WorkerSelector";
import {ApiService, Func, TimeUnit, Worker} from "../openapi";
import {SliderSelector} from "../components/SliderSelector";
import {FunctionSelector} from "../components/FunctionSelector";


const useCreateCronTask = (): [() => void, ReactElement] => {
    const {register, handleSubmit, formState} = useApiForm();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [currentWorkerSelections, setCurrentWorkerSelections] = useState<Worker[]>([]);
    const [functions, setFunctions] = useState<Func[]>([]);
    const [timeUnit, setTimeUnit] = useState(TimeUnit.SECOND);
    const [n, setN] = useState<number | undefined>();

    const createCronTaskModal = <Modal isCentered isOpen={isOpen} onClose={onClose} size='3xl'>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Create Cron Task</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <FormControl>
                    <FormLabel>Cron Task Name</FormLabel>
                    <Input {...register('name')}/>
                </FormControl>
                <WorkerSelector onWorkerChange={setCurrentWorkerSelections}/>
                <FormControl>
                    <FormLabel>Every</FormLabel>
                    <Input mb={2} defaultValue={1} value={n} onChange={event => {
                        if (event.target.value !== '') {
                            setN(Number(event.target.value));
                        } else {
                            setN(undefined);
                        }
                    }} type='number'/>
                    <SliderSelector defaultValue='seconds' options={[
                        {value: "milliseconds", display: "Millisecond"},
                        {value: "seconds", display: "Seconds"},
                        {value: "minutes", display: "Minutes"},
                        {value: "hour", display: "Hour"},
                        {value: "day", display: "Day"},
                        {value: "week", display: "Week"}
                    ]} onChange={value => setTimeUnit({
                        'milliseconds': TimeUnit.MILLISECOND,
                        'seconds': TimeUnit.SECOND,
                        'minutes': TimeUnit.MINUTE,
                        'hour': TimeUnit.HOUR,
                        'day': TimeUnit.DAY,
                        'week': TimeUnit.WEEK
                    }[value]!)}/>
                </FormControl>
                <FunctionSelector onChange={setFunctions}/>
            </ModalBody>
            <ModalFooter>
                <Button mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button isLoading={formState.isSubmitting} onClick={
                    handleSubmit(async () => {
                        if (functions.length !== 0) {
                            await ApiService.createCronTaskApiCronTaskPost({
                                function_uuid: functions[0].uuid,
                                timepoints: [{
                                  unit: timeUnit,
                                  n: n ?? 1
                                }],
                                worker_uuid: currentWorkerSelections[0].uuid
                            })
                        }
                    })
                } colorScheme='green'>Create</Button>
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
