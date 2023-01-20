import React, {useState} from "react";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box,
    Card,
    CardBody,
    Editable,
    EditablePreview,
    EditableTextarea,
    Flex,
    IconButton, Menu, MenuButton, MenuItem, MenuList,
    Text
} from "@chakra-ui/react";
import {AddIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Tag} from "../openapi";
import {KVTag} from "./KVTag";

export const TagSelector: React.FC<{ type: 'WORKER' | 'FUNCTION', namespace: string }> = ({type, namespace}) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [tmpTag, setTmpTag] = useState<string>('');
    const [tmpTagEnsured, setTmpTagEnsured] = useState(false);

    return <div>
        <Card variant='outline' minH={10}>
            <CardBody>
                <Badge mr={2} variant='outline' colorScheme={tmpTagEnsured ? 'blue' : 'gray'}>
                    <Flex alignItems='center'>
                        <Menu>
                            <MenuButton>
                                <IconButton mr={1} size='es' icon={<SearchIcon/>} aria-label='create'/>
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => {
                                    setTmpTagEnsured(true);
                                    setTmpTag('123123');
                                }}>123123</MenuItem>
                            </MenuList>
                        </Menu>
                        <Editable value={tmpTag} placeholder='tag'>
                            <EditablePreview/>
                            <EditableTextarea
                                as="input"
                                onChange={e => {
                                    setTmpTag(e.target.value);
                                    setTmpTagEnsured(false);
                                }}/>
                        </Editable>
                        <IconButton
                            ml={1}
                            size='es'
                            icon={<AddIcon/>}
                            aria-label='create'
                            onClick={() => {
                                if (!tmpTagEnsured) {
                                    return;
                                }
                                setTags((prevState) => {
                                    return [...prevState, {
                                        key: tmpTag,
                                        namespace: namespace,
                                        value: undefined
                                    }];
                                });
                            }}
                        />
                    </Flex>
                </Badge>

                <Badge mr={2} variant='outline' colorScheme='gray'>
                    <Flex alignItems='center'>
                        <IconButton mr={1} size='es' icon={<SearchIcon/>} aria-label='create'/>
                        <Editable placeholder='key'>
                            <EditablePreview/>
                            <EditableTextarea as="input"/>
                        </Editable>

                        <Text color='black' mr={2}>:</Text>

                        <IconButton mr={1} size='es' icon={<SearchIcon/>} aria-label='create'/>
                        <Editable placeholder='val'>
                            <EditablePreview/>
                            <EditableTextarea as="input"/>
                        </Editable>
                        <IconButton ml={1} size='es' icon={<AddIcon/>} aria-label='create'/>
                    </Flex>
                </Badge>

                <Box mt={3}>
                    {tags.map((tag, index) => <KVTag
                        key={index}
                        tagKey={tag.key}
                        value={tag.value}
                        onDelete={() => {
                            setTags((prevState) =>
                                prevState.filter((_, existTagIdx) => existTagIdx !== index)
                            )
                        }}/>)}
                </Box>
            </CardBody>
        </Card>
        <Accordion allowMultiple>
            <AccordionItem>
                <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                        <AddIcon mr={2} h={3}/> New Tag
                    </Box>
                    <AccordionIcon/>
                </AccordionButton>
                <AccordionPanel>
                    asdfdsf
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    </div>;
};
