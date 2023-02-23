import React, {useEffect, useState} from "react";
import {Flex, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack} from "@chakra-ui/react";

type Options<T extends string> = {value: T, display: React.ReactElement | string | number}[];

export function SliderSelector<T extends string>(props: {
    options: Options<T>,
    onChange?: (value: string) => void,
    defaultValue?: T extends string ? Options<T>[number]['value'] : never,
    placeholder?: string
}) {
    const {options, placeholder, onChange, defaultValue} = props;
    const [value2index, setValue2index] = useState(new Map<string, number>());
    const [currValue, setCurrValue] = useState<string>(defaultValue || options[0].value || '');

    useEffect(() => {
        const value = new Map<string, number>();
        for (let [idx, option] of Object.entries(options)) {
            value.set(option.value, Number(idx));
        }
        setValue2index(value);
    }, [options]);

    return <Flex>
        <Slider
            colorScheme='pink'
            onChange={(value) => {
                setCurrValue(options[value].value);
                onChange?.(options[value].value);
            }}
            value={value2index.get(currValue)}
            max={options.length - 1}
            min={0}
            mr={3}
        >
            <SliderTrack>
                <SliderFilledTrack/>
            </SliderTrack>
            <SliderThumb/>
        </Slider>
        <Select value={currValue} placeholder={placeholder} onChange={value => {
            setCurrValue(value.target.value);
            onChange?.(value.target.value);
        }}>
            {options.map((option, index) => <option key={index} value={option.value}>{option.display}</option>)}
        </Select>
    </Flex>
}