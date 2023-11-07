import React, {
    ReactElement,
    useRef, useState,
} from 'react';
import {
    Input, FormGroup, InputGroup, Button, Label, Dropdown, DropdownToggle, DropdownMenu,
} from 'reactstrap';
import { InputType } from 'reactstrap/types/lib/Input';


export interface CustomInputOption {
    name: string
    value: number
}

interface CustomInputProps<T> {
    name: string;
    label?: string;
    type: InputType;
    placeholder: string;
    value: T;
    options?: Array<CustomInputOption>;
    asterix?: string;
    obelix?: string;
    min?: number;
    readonly?: boolean;
    disabled?: boolean;
    blinkingRed?: boolean;
    toUpper?: boolean;
    dropdownBody?: ReactElement;
    onChange?: (value: T) => void;
    scanFn?: () => void;
}

const CustomInput = <T extends string | number | null>({
    name,
    label,
    type,
    placeholder,
    value,
    options,
    asterix,
    obelix,
    min,
    readonly = false,
    disabled = false,
    blinkingRed = false,
    toUpper=false,
    dropdownBody,
    onChange,
}: CustomInputProps<T>) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [
        openDropdown,
        setOpenDropdown,
    ] = useState<boolean>(false);

    const [
        focused,
        setFocused,
    ] = useState<boolean>(false);

    const colorOfTheInput = () => {
        if (blinkingRed) {
            return 'blinking-red';
        }
        if (!focused && obelix) {
            return 'light-red';
        }
        return '';
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(type === 'number') {
            if (!(/[0-9]/.test(event.key)) && event.key !== '.' && event.key !== 'Backspace' && event.key !== 'Delete'
                && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab' && event.key !== ',') {
                event.preventDefault();
            }
        }
    };

    return (
        <FormGroup className='formgroup'>
            <InputGroup>
                <Input
                    className={colorOfTheInput()}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    innerRef={inputRef}
                    value={value !== null ? value : ''}
                    readOnly={readonly}
                    min={min}
                    onKeyDown={handleKeyDown}
                    disabled={disabled || (type === 'select' && readonly)}
                    style={{ 'backgroundColor': readonly ? '#e9ecef' : '' }}
                    onFocus={() => {
                        if (dropdownBody) {
                            setOpenDropdown(true);
                        }
                        setFocused(true);
                    }}
                    onBlur={() => {
                        if (dropdownBody) {
                            setOpenDropdown(false);
                        }
                        setFocused(false);
                    }}
                    onChange={event => {
                        if (!onChange) {
                            return;
                        }
                        let inputValue = event.target.value;
                        if(toUpper){
                            inputValue = inputValue.toUpperCase();
                        }
                        if (options) {
                            const numericValue = Number(inputValue);
                            onChange((!isNaN(numericValue) ? numericValue : inputValue) as T);
                            return;
                        }
                        if (type === 'number') {
                            if (inputValue === '') {
                                onChange(null as T);
                            } else {
                                onChange(Number(inputValue) as T);
                            }
                        } else {
                            onChange(inputValue as T);
                        }
                    }}
                >
                    {options &&
                        <>
                            <option
                                disabled
                            ></option>
                            {options.map((option, index)  =>
                                <option
                                    key={index}
                                    value={option.value}
                                >{option.name}</option>,
                            )}
                        </>
                    }
                </Input>
            </InputGroup>
            {dropdownBody &&
                <Dropdown
                    isOpen={openDropdown}
                    toggle={() => null}
                    className='w-100'
                >
                    <DropdownToggle tag="span">
                        <span></span>
                    </DropdownToggle>
                    <DropdownMenu
                        className='w-100 p-0'
                    >
                        {dropdownBody}
                    </DropdownMenu>
                </Dropdown>
            }
        </FormGroup>
    );
};

export default CustomInput;
