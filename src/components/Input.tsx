"use client";

import React from 'react';

type InputProps = {
    name: string;
    placeholder?: string;
    value?: number
}

type NumberInputProps = InputProps & {
    min?: number,
    max?: number,
}

export function NumberInput({ name, placeholder, min, max, value }: NumberInputProps) {
    return (
        <input
            type="number"
            name={name}
            placeholder={placeholder}
            min={min}
            max={max}
            value={value}
            onChange={e => e.target.value = Math.min(max ?? 1, value ?? 1).toString()}
        />
    );
};
