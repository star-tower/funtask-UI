import React from "react";
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    IconButton, Menu,
    MenuButton,
    MenuItem,
    MenuList
} from "@chakra-ui/react";
import {Table, Thead, Tbody, Tr, Th, Td, chakra} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";

export const Worker: React.FC = () => {
    return <Box p={5}>
        <Card>
            <CardHeader>
                <Heading size='md'>Worker</Heading>
            </CardHeader>
            <CardBody>
                <Menu>
                    <MenuButton>
                        <IconButton
                            aria-label='new worker'
                            size='sm'
                            icon={<AddIcon/>}
                        />
                    </MenuButton>
                    <MenuList>
                        <MenuItem>add worker</MenuItem>
                        <MenuItem>add multiple workers</MenuItem>
                    </MenuList>
                </Menu>
            </CardBody>
            <Table>
                <Thead>

                </Thead>
                <Tbody>

                </Tbody>
            </Table>
        </Card>
    </Box>
}
