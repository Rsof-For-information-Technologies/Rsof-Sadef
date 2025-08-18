import { routes } from '@/config/routes';
import { Params } from '@/types/params';
import { findFirstAuthorizedUrl } from '@/utils/findFirstAuthorizedUrl';
import HttpError from '@/utils/httpError';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react'


interface ErrorProps {
    error?: HttpError;
}

function useError(data: ErrorProps) {
    const splittedMessage = data.error?.message.split("-") as [string, string]
    const errorCode = Number(splittedMessage[0]) || null
    const message = splittedMessage[1] || null;
    // const router = useRouter();
    // const params = useParams<Params>();

    // useEffect(() => {
    //     if (errorCode === 401 && message?.toLowerCase() === "unauthorized access") {
    //         const scopeUrl = findFirstAuthorizedUrl(params.locale)
    //         console.log({ scopeUrl })
    //         if (typeof scopeUrl === "undefined")
    //             router.push(`/${params.locale}${routes.auth.login}?logout=true`)

    //         if (scopeUrl)
    //             router.push(scopeUrl)

    //     }
    // }, [errorCode, message, router])
    return { errorCode, message }
}

export default useError