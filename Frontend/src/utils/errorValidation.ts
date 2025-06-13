import { FieldError } from "react-hook-form"

export const errorValidator = (field: FieldError | undefined) => {
    if (field && field.type !== "typeError") {
        return field?.message?.toString()
    }
}