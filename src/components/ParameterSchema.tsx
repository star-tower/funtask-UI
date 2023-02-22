import React, {useState} from "react";
import { withTheme } from "@rjsf/core";
import { Theme as ChakraUITheme } from "@rjsf/chakra-ui";
import {RJSFSchema} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import {Box, FormControl, FormLabel, Stack, StackDivider, Switch, Textarea} from "@chakra-ui/react";
import ReactJson from "react-json-view";


const Form = withTheme(ChakraUITheme);

export const ParameterSchema: React.FC<{
    schema: string
}> = ({schema}) => {
    const [edit, setEdit] = useState(false);
    return <Stack direction={'row'} divider={<StackDivider borderColor='gray.200'/>} align='stretch'>
        <Box flex='1' display='flex' flexDirection='column'>
            <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='email-alerts' mb='0'>Edit</FormLabel>
                <Switch onChange={event => setEdit(event.target.checked)} isChecked={edit}/>
            </FormControl>
            {edit ?
                <Textarea flexGrow={1} value={schema}/> :
                <ReactJson src={JSON.parse(schema)}/>}
        </Box>
        <Box flex='1'>
            <Form
                schema={JSON.parse(schema) as RJSFSchema}
                validator={validator}
            />
        </Box>
    </Stack>
}