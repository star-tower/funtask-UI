import React, {useState} from "react";
import {
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuList,
    Text
} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";

export function SearchInput<T>(props: {
    onSearch: (value: string) => void,
    values: T[],
    loading: boolean,
    render: (value: T) => React.ReactElement
}) {
    const [searchValue, setSearchValue] = useState('');
    return <InputGroup>
        <InputLeftElement children={
            <Menu autoSelect>
                <MenuButton onClick={() => props.onSearch(searchValue)}>
                    <IconButton isLoading={props.loading} aria-label='search' size='es'
                                icon={<SearchIcon/>}/>
                </MenuButton>
                <MenuList>
                    {props.values.length === 0 ? <Text color='grey'>empty</Text> : <></>}
                    {props.values.map((value, index) => <div
                        key={index}
                    >
                        {props.render(value)}
                    </div>)}
                </MenuList>
            </Menu>
        }/>
        <Input onChange={(e) => setSearchValue(e.target.value)}/>
    </InputGroup>
}
