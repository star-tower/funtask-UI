import React from "react";
import {Link as RouterLink} from "react-router-dom";
import {Outlet} from "react-router-dom";
import {
    Avatar,
    Center,
    Flex,
    IconButton,
    Link, Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Select,
    Spacer
} from "@chakra-ui/react";
import {RepeatIcon} from "@chakra-ui/icons";

const NavigatorUnit: React.FC<{ children: React.ReactNode }> = ({children}) => <Center pl={8}>
    {children}
</Center>


export const Navigator: React.FC = () => {
    return <>
        <Flex h={10}>
            <NavigatorUnit><Link as={RouterLink} to='/worker'>worker</Link></NavigatorUnit>
            <NavigatorUnit><Link as={RouterLink} to='/task'>task</Link></NavigatorUnit>
            <NavigatorUnit><Link as={RouterLink} to='/task_group'>task group</Link></NavigatorUnit>
            <NavigatorUnit><Link as={RouterLink} to='/cron_task'>cron task</Link></NavigatorUnit>
            <NavigatorUnit><Link as={RouterLink} to='/function'>function</Link></NavigatorUnit>
            <NavigatorUnit><Link as={RouterLink} to='/arguments_pool'>arguments pool</Link></NavigatorUnit>
            <NavigatorUnit><Link as={RouterLink} to='/connections'>connections</Link></NavigatorUnit>
            <Spacer/>
            <NavigatorUnit>
                <Select size='xs' placeholder='namespace'></Select>
                <IconButton
                    ml={2}
                    mr={4}
                    size='xs'
                    variant='outline'
                    aria-label='refresh'
                    icon={<RepeatIcon/>}
                />
            </NavigatorUnit>
            <Center mr={10}>
                <Menu>
                    <MenuButton>
                        <Avatar size='sm' name='User'/>
                    </MenuButton>
                    <Portal>
                        <MenuList>
                            <MenuItem>info</MenuItem>
                            <MenuItem>log out</MenuItem>
                        </MenuList>
                    </Portal>
                </Menu>
            </Center>
        </Flex>
        <Outlet/>
    </>
}