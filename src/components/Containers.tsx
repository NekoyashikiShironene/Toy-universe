import React from "react";

type TContainer = {
    children?: React.ReactNode,
    className?: string,
    rest?: unknown[]
}

export function ScreenContainer({ children, className, ...rest }: TContainer) {
    return (
        <div className={`screen-container ${className ?? ""}`} {...rest} >
            {children}
        </div>
    )
}

export function ContentContainer({ children, className, ...rest }: TContainer) {
    return (
        <article className={`content-container ${className ?? ""}`} {...rest} >
            {children}
        </article>
    )
}