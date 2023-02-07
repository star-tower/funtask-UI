import React, {useEffect, useState} from "react";
import {
    FormControl,
    FormLabel,
    IconButton, Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton, MenuItem,
    MenuList, Text
} from "@chakra-ui/react";
import {ApiService, Worker} from "../openapi";
import {SearchIcon} from "@chakra-ui/icons";
import {Worker as WorkerComponent} from "./Worker";

export const WorkerSelector: React.FC<{onWorkerChange: (workers: Worker[]) => void}> = ({onWorkerChange}) => {
    const [workerSearchValue, setWorkerSearchValue] = useState("");
    const [matchedWorkers, setMatchedWorkers] = useState<Worker[]>([]);
    const [currentWorkerSelections, setCurrentWorkerSelections] = useState<Worker[]>([]);

    useEffect(() => onWorkerChange(currentWorkerSelections), [currentWorkerSelections]);

    return <FormControl>
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
}