import cn from "@/utils/class-names";
import { useFormStatus } from "react-dom";
import { Button } from "rizzui";
import React, { MouseEvent } from "react"


interface FormStatusButtonProps {
    children?: React.ReactNode;
    className?: string;
    type?: "button" | "reset" | "submit"
    size?: "lg" | "sm" | "md" | "xl" | undefined;
    as?: "button" | "span"
    disabled?: boolean;
    onClick?: (e?: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    isLoading?: boolean;
}
export function FormStatusButton({ children, isLoading, className, type = "submit", size, onClick, as, disabled, ...props }: FormStatusButtonProps) {

    const formState = useFormStatus();

    return (
        <Button
            as={as}
            onClick={onClick as any}
            type={type}
            disabled={disabled || formState.pending}
            isLoading={formState.pending || isLoading}
            size={size}
            className={cn("w-full @xl:w-auto", className)}
            {...props}
        >
            {children}
        </Button>
    )
}