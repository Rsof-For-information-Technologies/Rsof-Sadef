import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { ActionIcon } from "rizzui";

const ThemeSwitcer = () => {

    const { setTheme, theme } = useTheme();

    const [mounted, setMounted] = useState(false);

    const setThemeHandler = () => {
        if (localStorage.getItem("theme") === "system") {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                setTheme("dark")
            else
                setTheme("light")
        }

        if (theme === "dark") {
            setTheme("light")
            localStorage.setItem("theme", "light")
        }

        else if (theme === "light") {
            localStorage.setItem("theme", "dark")
            setTheme("dark")
        }


    }

    useEffect(() => {

        if (localStorage.getItem("theme")) {
            if (localStorage.getItem("theme") === "system") {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                    setTheme("dark")
                else
                    setTheme("light")
            }
            else setTheme(localStorage.getItem("theme") as string)

        }

        else {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                setTheme("dark")
            else
                setTheme("light")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (<>
        <ActionIcon onClick={setThemeHandler}
            aria-label="Notification"
            variant="text"
            className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9 dark:bg-gray-100"
        >
            <span>
                {
                    theme === "light"
                        ? <MdDarkMode />
                        : theme === "dark"
                            ? <CiLight />
                            : <MdDarkMode />
                }
            </span>
        </ActionIcon>
    </>)
}

export default ThemeSwitcer