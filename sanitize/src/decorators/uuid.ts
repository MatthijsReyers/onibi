import { UuidSanitizerRules } from "../uuid.types";
import { decoratorFactory } from "./factory";
import uuid from './../uuid';
import { Field } from "../field";

export function Uuid(rules?: Partial<UuidSanitizerRules>)
{
    function check(value: any, key: string) {
        const rulesWithField: Partial<UuidSanitizerRules & Field> = Object.assign({}, rules || {}); 
        rulesWithField['field'] = key;
        return uuid.orNull(value, rulesWithField);
    }
    return decoratorFactory(check);
}
