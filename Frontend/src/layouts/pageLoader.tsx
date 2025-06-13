import React, { ComponentProps } from 'react'
import { Loader as RizzLoader } from 'rizzui';

interface LoaderProps extends ComponentProps<"div"> {
    children: React.ReactNode;
    loading?: boolean;
    className?: string
}
const PageLoader = ({ children, loading, className, ...rest }: LoaderProps) => {
    if (!className) {
        className = "flex w-full z-40 justify-center bg-[#47556985] min-h-[calc(100vh_-_100px)] h-full items-center absolute left-0 rounded-lg top-0"
    }
    return (
        <>
            {
                <div className={className}
                    style={{ display: loading === false ? "none" : "" }}
                >
                    <span >
                        <RizzLoader className='text-white w-40' />
                    </span>

                </div>
            }
            {children}
        </>
    )
}

export default PageLoader