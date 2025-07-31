import { routes } from '@/config/routes';
import { findFirstAuthorizedUrl } from '@/utils/findFirstAuthorizedUrl';
import HttpError from '@/utils/httpError';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'


interface ErrorProps {
    error?: HttpError;
}

function useError(data: ErrorProps) {
    const splittedMessage = data.error?.message.split("-") as [string, string]
    const errorCode = Number(splittedMessage[0]) || null
    const message = splittedMessage[1] || null;
    const router = useRouter();

    // useEffect(() => {
    //     if (errorCode === 401 && message?.toLowerCase() === "unauthorized access") {
    //         const scopeUrl = findFirstAuthorizedUrl()
    //         console.log({ scopeUrl })
    //         if (typeof scopeUrl === "undefined")
    //             router.push(`/${routes.login}?logout=true`)

    //         if (scopeUrl)
    //             router.push(scopeUrl)

    //     }
    // }, [errorCode, message, router])
    return { errorCode, message }
}

export default useError