import React, {ReactElement, useEffect, useState} from "react";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
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
    Skeleton,
    Stack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
    Text,
    useInterval,
    InputGroup,
    InputRightAddon,
    HStack,
    Accordion,
    AccordionButton,
    AccordionPanel, AccordionIcon, AccordionItem
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {TagSelector} from "../components/TagSelector";
import {ApiService, Worker as WorkerModel} from "../openapi";
import {useApiForm} from "../hooks/openapi";
import {KVTag} from "../components/KVTag";
import {WorkerTaskViewer} from "../components/WorkerTaskViewer";

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
                    <TagSelector type='WORKER'></TagSelector>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button isLoading={formState.isSubmitting} colorScheme='green' onClick={
                    handleSubmit(async (data) => {
                        await ApiService.increaseWorkerApiWorkersPost({
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

const WorkerTable = () => {
    const [workers, setWorkers] = useState<WorkerModel[] | undefined>(undefined);
    const [limit, setLimit] = useState(20);
    const [cursor, setCursor] = useState<number | undefined>();
    const [nextCursor, setNextCursor] = useState<number | undefined>();
    const [currCursorIdx, setCurrCursorIdx] = useState<number>(0);

    const columnHelper = createColumnHelper<WorkerModel>();

    const columns = [
        columnHelper.accessor("uuid", {
            cell: (info) => info.getValue(),
            header: "uuid"
        }),
        columnHelper.accessor("name", {
            cell: (info) => info.getValue() || <Text color='gray'>/anonymous/</Text>,
            header: "name"
        }),
        columnHelper.accessor("status", {
            cell: (info) => info.renderValue(),
            header: "status"
        }),
        columnHelper.accessor("last_heart_beat", {
            cell: (info) => info.getValue(),
            header: "last heart beat"
        }),
        columnHelper.accessor("start_time", {
            cell: (info) => info.getValue(),
            header: "start at"
        }),
        columnHelper.accessor("stop_time", {
            cell: (info) => info.getValue(),
            header: "stop at"
        }),
        columnHelper.accessor("tags", {
            cell: (info) => {
                let value = info.getValue();
                return value ? value.map((tag, idx) => <KVTag
                    key={idx}
                    tagKey={tag.key}
                    value={tag.value}
                />) : <></>;
            },
            header: "tags"
        })
    ]

    const table = useReactTable({
        columns,
        data: workers ?? [],
        getCoreRowModel: getCoreRowModel()
    });

    useEffect(() => {
        ApiService.getWorkersApiWorkersGet(limit).then((resp) => {
            setWorkers(resp.workers);
            setNextCursor(resp.cursor);
        });
    }, [limit]);

    useInterval(() => {
        ApiService.getWorkersApiWorkersGet(limit, cursor).then((resp) => {
            setWorkers(resp.workers);
        });
    }, 1000)

    return <>
        {
            workers ?
                <Table>
                    <Thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => <Th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </Th>
                                )}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table.getRowModel().rows.map((row) => <>
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => <Td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>)}
                                </Tr>
                                <Tr key={row.id + '_detail'} p={0}>
                                    <Td colSpan={7} p={0} borderBottomColor='#D3D3D3'>
                                        <Accordion key={row.id + '_tasks'} allowMultiple border='white'>
                                            <AccordionItem>
                                                <h2>
                                                    <AccordionButton>
                                                        <Box as="span" flex='1' textAlign='left'>
                                                            Charts
                                                        </Box>
                                                        <AccordionIcon/>
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    <WorkerTaskViewer
                                                        workerUUID={row.getValue('uuid')}
                                                        workerStartTime={new Date(row.getValue('start_time'))}
                                                        workerStopTime={
                                                            row.getValue('stop_time') === null ? undefined : new Date(row.getValue('stop_time'))
                                                        }
                                                    />
                                                </AccordionPanel>
                                            </AccordionItem>
                                        </Accordion>
                                    </Td>
                                </Tr>
                            </>
                        )}
                    </Tbody>
                </Table> : <Stack>
                    <Skeleton height='20px'/>
                    <Skeleton height='20px'/>
                    <Skeleton height='20px'/>
                </Stack>
        }
    </>
}

export const Worker: React.FC = () => {
    const [openCreateWorkerModal, createWorkerModal] = useCreateWorker();
    const [inactiveSecond, setInactiveSecond] = useState<number | undefined>();
    return <>
        {createWorkerModal}
        <Box p={5}>
            <Card>
                <CardHeader>
                    <Heading size='md'>Worker</Heading>
                </CardHeader>
                <CardBody>
                    <HStack>
                        <IconButton
                            aria-label='new worker'
                            size='sm'
                            icon={<AddIcon/>}
                            onClick={openCreateWorkerModal}
                        />
                        <InputGroup size='sm' maxW='15rem'>
                            <Input value={inactiveSecond} onChange={event => {
                                if (event.target.value !== '') {
                                    setInactiveSecond(Number(event.target.value));
                                } else {
                                    setInactiveSecond(undefined);
                                }
                            }} placeholder='Inactive To Dead' type='number'/>
                            <InputRightAddon children='second'/>
                        </InputGroup>
                    </HStack>
                </CardBody>
            </Card>
            <Box mt={3}>
                <WorkerTable/>
            </Box>
        </Box>
    </>
}
