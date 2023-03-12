import React, {useEffect, useMemo, useState} from "react";
import {
    Badge,
    Box, Flex,
    FormControl,
    FormLabel, HStack,
    Input, Radio,
    RadioGroup, Spinner, Stack,
    useInterval
} from "@chakra-ui/react";
import {Allotment} from "allotment";
import {useVirtualizer} from '@tanstack/react-virtual';
import {useDebounce, useThrottle, useThrottleFn} from "react-use";
import {useQuery} from "react-query";
import {ApiService, TaskDescribe, TaskStatus} from "../openapi";

type TimeScale = "second" | "minute" | "hour" | "day";

const time2second = (date: Date) => Math.floor(date.getTime() / 1000);

const calcRangeSeconds = (start: Date, end?: Date) => (end === undefined ? time2second(new Date()) : time2second(end)) - time2second(start);

const timeAddSecondsDelta = (time: Date, secondDelta: number) => new Date(time.getTime() + secondDelta * 1000);

const date2StandardStr = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
const date2Str = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}min`;
const splitDateStr = (date: Date, scale: TimeScale) => {
    const [second, minute, hour, day, month, year] = [
        date.getSeconds(),
        date.getMinutes(),
        date.getHours(),
        date.getDate(),
        date.getMonth() + 1,
        date.getFullYear()
    ];
    switch (scale) {
        case "second":
            return [date2Str(date), second === 0 ? `${minute}min` : `${second}s`];
        case "minute":
            return [`${year}-${month}-${day} ${hour}h`, minute === 0 ? `${hour}h` : `${minute}min`];
        case "hour":
            return [`${year}-${month}-${day}d`, hour === 0 ? `${day}d` : `${hour}h`];
        case "day":
            return [`${year}-${month}m`, day === 0 ? `${month}m` : `${day}d`];
    }
}

const scaleSecondMap = {
    "second": 1,
    "minute": 60,
    "hour": 60 * 60,
    "day": 24 * 60 * 60
};

const getCurrentRange = (
    viewCurrStartTime: Date,
    currScaleSecond: number,
    overscanNum: number,
    displayHeight: number
): [Date, Date] => {
    const renderStartTime = timeAddSecondsDelta(viewCurrStartTime, -currScaleSecond * overscanNum);
    const renderEndTime = timeAddSecondsDelta(
        viewCurrStartTime,
        currScaleSecond * Math.ceil(displayHeight / currScaleSecond) + overscanNum * currScaleSecond
    )
    return [renderStartTime, renderEndTime];
}

const timeSub2second = (createTime: string, stopTime?: string | null) => {
    const start = new Date(createTime);
    const stop = (stopTime && new Date(stopTime)) || new Date();
    return Math.ceil((stop.getTime() - start.getTime()) / 1000);
}

export const WorkerTaskViewer: React.FC<{
    workerUUID: string,
    workerStartTime: Date,
    workerStopTime?: Date,
    defaultLatestSecond?: number
}> = ({workerStartTime, workerStopTime, defaultLatestSecond, workerUUID}) => {
    const parentRef = React.useRef<HTMLDivElement | null>(null);
    const [viewTimeScale, setViewTimeScale] = useState<TimeScale>("hour");
    const cellHeight = 25;
    const workerHeight = 400;
    const overscan = 2;
    const [range, setRange] = useState<number>(
        () => Math.ceil(calcRangeSeconds(workerStartTime, workerStopTime) / scaleSecondMap[viewTimeScale])
    );

    const rowVirtualizer = useVirtualizer({
        count: range,
        getScrollElement: () => parentRef.current,
        estimateSize: () => cellHeight,
        overscan
    });
    const viewCurrStartTime = timeAddSecondsDelta(
        workerStartTime,
        Math.ceil(rowVirtualizer.scrollOffset / cellHeight * scaleSecondMap[viewTimeScale])
    );
    const [scroll2NextRender, setScroll2NextRender] = useState<Date | undefined>(undefined);
    const renderTimeRange = useThrottle(
        getCurrentRange(viewCurrStartTime, scaleSecondMap[viewTimeScale], overscan, workerHeight),
        1000
    );

    useInterval(() => {
        if (workerStopTime === undefined) {
            setRange(() => Math.ceil(
                calcRangeSeconds(workerStartTime, workerStopTime) / scaleSecondMap[viewTimeScale])
            );
        }
    }, 1000);
    const {
        data,
        isLoading,
        isFetching
    } = useQuery(['workerDesc', renderTimeRange], () => ApiService.getTasksApiTasksOnWorkerGet(
        workerUUID,
        date2StandardStr(renderTimeRange[0]),
        20,
        date2StandardStr(renderTimeRange[1])
    ));

    useEffect(() => {
        // if scroll to next render is not undefined, then scroll to it, and set it to undefined again
        if (scroll2NextRender !== undefined) {
            rowVirtualizer.scrollToIndex(
                Math.ceil(
                    (time2second(scroll2NextRender) - time2second(workerStartTime)) / scaleSecondMap[viewTimeScale]
                )
            );
            setScroll2NextRender(undefined);
        }
    }, [scroll2NextRender, viewTimeScale, workerStartTime, rowVirtualizer]);

    const scaleValue2task = useMemo<Record<number, TaskDescribe[]> | undefined>(() => data?.task_describes.reduce<Record<number, TaskDescribe[]>>(
        (previousValue, currentValue) => {
            const currTime = (new Date(currentValue.create_time)).getTime()
            previousValue[currTime] = [...(previousValue[currTime] ?? []), currentValue];
            return previousValue;
        }, {}
    ), [data]);

    return <Box h={`calc(${workerHeight}px + 36px + 30px + 50px)`}>
        <Allotment defaultSizes={[1, 4]}>
            <Allotment.Pane minSize={400}>
                <Box p={3}>
                    <FormControl display='flex' alignItems='center' mb={3}>
                        <FormLabel m={0} mr={2} whiteSpace='nowrap'>Start Date</FormLabel>
                        <Input
                            placeholder="Select Date and Time"
                            size="xs"
                            type="datetime-local"
                        />
                    </FormControl>
                    <FormControl display='flex' alignItems='center' mb={3}>
                        <FormLabel m={0} mr={2} whiteSpace='nowrap'>Time Scale</FormLabel>
                        <RadioGroup
                            w='100%'
                            value={viewTimeScale}
                            onChange={(value) => {
                                setRange(() => Math.ceil(
                                    calcRangeSeconds(workerStartTime, workerStopTime) / scaleSecondMap[value as TimeScale]
                                ));
                                setViewTimeScale(value as TimeScale);
                                // set current time pos for different scale rendering
                                setScroll2NextRender(viewCurrStartTime);
                            }}
                        >
                            <Stack justifyContent='space-evenly' display='flex' direction='row'>
                                <Radio defaultChecked value='second'>Second</Radio>
                                <Radio value='minute'>Minute</Radio>
                                <Radio value='hour'>Hour</Radio>
                                <Radio value='day'>Day</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <Flex alignItems='center' mb={3}>
                        <Badge colorScheme='purple'>{splitDateStr(viewCurrStartTime, viewTimeScale)[0]}</Badge>
                        {(isLoading || isFetching) && <Spinner ml={3} size='xs'/>}
                    </Flex>
                    <Box
                        ref={parentRef}
                        style={{
                            height: `400px`,
                            overflow: 'auto'
                        }}
                    >
                        <Box
                            h={`${rowVirtualizer.getTotalSize()}px`}
                            w='calc(100% - 50px)'
                            position='relative'
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                                const currTasks = scaleValue2task && scaleValue2task[
                                    timeAddSecondsDelta(workerStartTime, virtualItem.index * scaleSecondMap[viewTimeScale]).getTime()
                                    ];
                                return <>
                                    <Box
                                        key={virtualItem.key + '_time'}
                                        position='absolute'
                                        top={0}
                                        height={`${virtualItem.size}px`}
                                        transform={`translateY(${virtualItem.start}px)`}
                                    >
                                        <Badge colorScheme='purple'>
                                            {splitDateStr(timeAddSecondsDelta(
                                                workerStartTime,
                                                virtualItem.index * scaleSecondMap[viewTimeScale]
                                            ), viewTimeScale)[1]}
                                        </Badge>
                                    </Box>
                                    {currTasks && <HStack
                                        key={virtualItem.key}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 50,
                                            width: '100%',
                                            height: `${virtualItem.size}px`,
                                            transform: `translateY(${virtualItem.start}px)`,
                                        }}
                                    >
                                        {currTasks.map((value, index) => <Box
                                            key={index}
                                            w={3}
                                            h={`${Math.max(timeSub2second(value.create_time, value.stop_time), 1 * cellHeight - 4)}px`}
                                            backgroundColor={{
                                                [TaskStatus.RUNNING]: "green",
                                                [TaskStatus.DIED]: "red",
                                                [TaskStatus.ERROR]: "red",
                                                [TaskStatus.SKIP]: "",
                                                [TaskStatus.QUEUED]: "",
                                                [TaskStatus.SCHEDULED]: "",
                                                [TaskStatus.UNSCHEDULED]: "",
                                                [TaskStatus.SUCCESS]: "green"
                                            }[value.status]}>
                                        </Box>)}
                                    </HStack>}
                                </>
                            })}
                        </Box>
                    </Box>
                </Box>
            </Allotment.Pane>
            <Allotment.Pane snap>
                <Box p={3}>
                    <Box h='100px'>76576asdfdfsadfdfsdfasdfasdfdsflksdjflksdjolk75</Box>
                </Box>
            </Allotment.Pane>
        </Allotment>
    </Box>
}
