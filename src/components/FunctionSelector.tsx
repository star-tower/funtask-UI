import React, {useEffect, useState} from "react";
import {Func, FuncWithCursor, ParameterSchema} from "../openapi"
import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box,
    Button, Checkbox, Flex,
    FormControl,
    FormLabel,
    Input, MenuItem, Stack, Text,
    Textarea, Tooltip
} from "@chakra-ui/react";
import {useApi, useApiForm} from "../hooks/openapi";
import {ApiService} from "../openapi";
import Editor from "@monaco-editor/react";
import {encode as base64_encode} from "base-64";
import {SearchInput} from "./SearchInput";
import {KVTag} from "./KVTag";
import {ParameterSchema as ParameterSchemaComp} from "./ParameterSchema";

export const FunctionSelector: React.FC<{
    onChange?: (functions: Func[]) => void,
    onlyOne?: boolean
}> = ({onlyOne, onChange}) => {
    const [functions, setFunctions] = useState<Func[]>([]);
    const {handleSubmit: createFuncHandler, formState: createFuncFormState, register: createFuncRegister} = useApiForm();
    const [editorValue, setEditorValue] = useState<string | undefined>("def fun(state, logger):\n    ...\n");
    const {error: searchErr, loading: searchLoading, result: queryResult, query} = useApi<FuncWithCursor>();
    const {loading: schemaGenLoading, result: schemaGenResult, query: schemaQuery} = useApi<ParameterSchema>();

    useEffect(() => onChange?.(functions), [functions, onChange]);

    return <div>
        <FormControl>
            <FormLabel>Search Function Name</FormLabel>
            <SearchInput
                onSearch={(value) => {query(() => ApiService.getFuncApiFuncGet(10, undefined, value))}}
                loading={searchLoading}
                values={queryResult?.funcs ?? []}
                render={func => <MenuItem onClick={() => {
                    if (onlyOne) {
                        setFunctions([func]);
                    } else {
                        setFunctions(prevState => {
                            if (prevState.filter(value => value.uuid === func.uuid).length === 0) {
                                return [...prevState, func];
                            }
                            return prevState;
                        })
                    }
                }}>
                    <Tooltip label={func.description}>
                        <Stack>
                            <Text>
                                F: {func.name}
                            </Text>
                            <Text color='grey' fontSize='xs'>{func.uuid}</Text>
                            {func.dependencies.length && <Text color='grey' fontSize='xs'>{JSON.stringify(func.dependencies)}</Text>}
                            <Flex>
                                {func.tags?.map(tag => <KVTag tagKey={tag.key} value={tag.value}/>)}
                            </Flex>
                        </Stack>
                    </Tooltip>
                </MenuItem>}
            />
        </FormControl>
        <Box mt={3}>
            {functions.map((func, index) => <KVTag
                key={index}
                tagKey={func.name ?? ''}
                value={func.uuid}
                onDelete={() => {
                    setFunctions(prevState => prevState.filter(
                        item => item.uuid !== func.uuid
                    ));
                }}
            />)}
        </Box>
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
                        <Checkbox mt={3}>Fat Function</Checkbox>
                        <Flex justifyContent='flex-end' mt={2}>
                            <Button
                                isLoading={schemaGenLoading}
                                onClick={() => schemaQuery(() => ApiService.getFuncSchemaApiFuncSchemaGet(
                                    base64_encode(editorValue ?? "")
                                ))}
                            >Generate Schema</Button>
                        </Flex>
                    </FormControl>
                    {schemaGenResult &&
                        <ParameterSchemaComp schema={schemaGenResult.json_schema}/>
                    }
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