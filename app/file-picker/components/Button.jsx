import React from 'react'
import {cn} from '@/utils/cn'

const Button = ({
                    children,
                    onClick,
                    type = "button",
                    className = "",
                    disabled = false,
                    ...rest
                }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "transition duration-200 focus:outline-none py-1 px-3 min-w-fit flex items-center gap-1",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button
