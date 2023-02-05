import React, {useEffect, useState} from "react";
import {Func} from "../openapi"
import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box,
    Button, Flex,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton, MenuItem, MenuList, Textarea
} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import {useApiForm} from "../hooks/openapi";
import {ApiService} from "../openapi";
import Editor from "@monaco-editor/react";
import {encode as base64_encode} from "base-64";

export const FunctionSelector: React.FC<{
    onChange?: (functions: Func[]) => void,
    onlyOne?: boolean
}> = ({onlyOne, onChange}) => {
    const [functions, setFunctions] = useState<Func[]>([]);
    const [searchFunctionsRes, setSearchFunctionsRes] = useState<Func[]>([]);
    const {register, handleSubmit, formState} = useApiForm();
    const {handleSubmit: createFuncHandler, formState: createFuncFormState, register: createFuncRegister} = useApiForm();
    const [editorValue, setEditorValue] = useState<string | undefined>("def fun(state, logger):\n    ...\n");

    useEffect(() => onChange?.(functions), [functions, onChange]);

    return <div>
        <FormControl>
            <FormLabel>Function Name</FormLabel>
            <InputGroup>
                <InputLeftElement children={
                    <Menu>
                        <MenuButton onClick={() => handleSubmit(async (form) => {
                            const resp = await ApiService.getFuncApiFuncGet(10, undefined, form['search']);
                            setSearchFunctionsRes(resp.funcs);
                        })}>
                            <IconButton isLoading={formState.isSubmitting} aria-label='search' size='es'
                                        icon={<SearchIcon/>}/>
                        </MenuButton>
                        <MenuList>
                            {searchFunctionsRes.map((func, index) => <MenuItem
                                key={index}
                                onClick={() => {
                                    if (onlyOne) {
                                        setFunctions([func]);
                                    } else {
                                        setFunctions(prevState => [...new Set([...prevState, func])])
                                    }
                                }}
                            >
                                {func.name}
                            </MenuItem>)}
                        </MenuList>
                    </Menu>
                }/>
                <Input {...register('search')}/>
            </InputGroup>
        </FormControl>
        <Accordion allowToggle>
            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                            Create Function
                        </Box>
                        <AccordionIcon/>
                    </AccordionButton>
                </h2>
                <AccordionPanel>
                    <FormControl mb={2}>
                        <FormLabel>Function Body</FormLabel>
                        <Editor
                            onChange={(value => setEditorValue(value))}
                            value={editorValue}
                            height='20vh'
                            language='python'
                            theme='vs-dark'
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Function Name</FormLabel>
                        <Input {...createFuncRegister('name')}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Function description</FormLabel>
                        <Textarea {...createFuncRegister('description')}/>
                    </FormControl>
                    <Flex justifyContent='flex-end' mt={2}>
                        <Button
                            isLoading={createFuncFormState.isSubmitting}
                            colorScheme='green'
                            onClick={createFuncHandler(async (form) => {
                                const resp = await ApiService.addFuncApiFuncPost({
                                    dependencies: [],
                                    description: form.description,
                                    name: form.name,
                                    func_base64: base64_encode(editorValue ?? "")
                                });
                                setFunctions(prevState => [...prevState, resp])
                            })}>Create Function</Button>
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    </div>;
}