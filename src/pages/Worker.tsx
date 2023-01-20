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
    NumberInputStepper, Skeleton, Stack,
    Table,
    Tbody, Td, Th,
    Thead, Tr,
    useDisclosure
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {TagSelector} from "../components/TagSelector";
import {ApiService, Worker as WorkerModel} from "../openapi";
import {useApiForm} from "../hooks/openapi";
import {KVTag} from "../components/KVTag";

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

const WorkerTable = () => {
    const [workers, setWorkers] = useState<WorkerModel[] | undefined>(undefined);
    const [limit, setLimit] = useState(20);
    const [cursors, setCursors] = useState<number | null>(null);
    const [currCursorIdx, setCurrCursorIdx] = useState<number>(0);

    const columnHelper = createColumnHelper<WorkerModel>();

    const columns = [
        columnHelper.accessor("uuid", {
            cell: (info) => info.getValue(),
            header: "uuid"
        }),
        columnHelper.accessor("name", {
            cell: (info) => info.getValue(),
            header: "name"
        }),
        columnHelper.accessor("status", {
            cell: (info) => info.renderValue(),
            header: "status"
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
        ApiService.getWorkersApiGetWorkersPost({
            limit: limit
        }).then((resp) => {
            setWorkers(resp.workers);
            setCursors(resp.cursor);
        });
    }, [limit]);
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
                        {table.getRowModel().rows.map((row) => <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => <Td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Td>)}
                            </Tr>
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
            </Card>
            <WorkerTable/>
        </Box>
    </>
}
