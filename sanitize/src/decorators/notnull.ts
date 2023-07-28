import { decoratorFactory } from "./factory";
import { Http422Error } from "@onibi/errors";

export function NotNull()
{
    function check(value: any, key: string) {
        if (value === null || value === undefined) {
            throw Http422Error.withNullField(key);
        }
        return value;
    }
    return decoratorFactory(check);
}
