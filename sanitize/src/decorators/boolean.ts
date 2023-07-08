import { decoratorFactory } from './factory';
import bool from './../boolean';
import { BooleanSanitizerRules } from './../boolean.types';
import { Field } from '../field';

export function Bool(rules?: Partial<BooleanSanitizerRules>)
{
    function check(value: any, key: string) {
        const rulesWithField: Partial<BooleanSanitizerRules & Field> = Object.assign({}, rules || {}); 
        rulesWithField['field'] = key;
        return bool(value, rulesWithField);
    }
    return decoratorFactory(check);
}
