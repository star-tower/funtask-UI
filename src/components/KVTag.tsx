import React from "react";
import {Badge, Flex, IconButton, Text} from "@chakra-ui/react";
import {CloseIcon} from "@chakra-ui/icons";

export const KVTag: React.FC<{
    tagKey: string,
    value?: string | null,
    onDelete?: (key: string, value?: string | null) => void
}> = ({tagKey, value, onDelete}) => <Badge
        variant='outline'
        colorScheme='green'
        mr={2}
    >
        <Flex alignItems='center'>
            <Text fontSize='sm'>
                {tagKey}
                {value ? ': ' + value : ''}
            </Text>
            {onDelete ? <IconButton
                aria-label='delete'
                icon={<CloseIcon/>}
                size='es'
                ml={1}
                onClick={() => onDelete(tagKey, value)}
            /> : <></>}
        </Flex>
    </Badge>
