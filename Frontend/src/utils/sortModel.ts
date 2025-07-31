export function sortModel<data>(sortType: 'asc' | 'desc', keys?: (keyof data)[] | string[]) {
    return (a: data, b: data) => {
        let valueA: any, valueB: any
        if (keys && keys?.length && typeof keys !== "string") {
            keys.forEach((key, index, arr) => {
                if ((arr.length - 1) === 0) {

                    valueA = (a as any)?.[key]
                    valueB = (b as any)?.[key]

                }
                else if (index === arr.length - 1) {

                    valueA = valueA?.[key]
                    valueB = valueB?.[key]

                }
                else if (index === 0) {
                    valueA = { ...(a as any)?.[key] }
                    valueB = { ...(b as any)?.[key] }

                }

                else {
                    valueA = { ...valueA?.[key] }
                    valueB = { ...valueB?.[key] }
                }

            })
        }
        else {
            valueA = a
            valueB = b
        }

        if (sortType === 'desc') {
            if (valueA > valueB) {
                return -1;
            }
            if (valueB > valueA) {
                return 1;
            }
            return 0;
        }
        else {
            if (valueB > valueA) {
                return -1;
            }
            if (valueA > valueB) {
                return 1;
            }
            return 0;
        }
    }
};