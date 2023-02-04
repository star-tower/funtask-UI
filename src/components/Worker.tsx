import React from "react";
import {Worker as WorkerModel} from "../openapi/models/Worker"
import {Card, CardBody, Text} from "@chakra-ui/react";

export const Worker: React.FC<{worker: WorkerModel}> = ({worker}) => {
    return <Card>
        <CardBody>
            <Text>{worker.uuid}</Text>
            {worker.name}
        </CardBody>
    </Card>
}