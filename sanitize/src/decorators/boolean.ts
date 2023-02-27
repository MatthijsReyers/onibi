import { decoratorFactory } from './factory';
import bool from './../boolean';
import { BooleanSanitizerRules } from './../boolean.types';

export function Bool(rules?: Partial<BooleanSanitizerRules>)
{
    function check(value: any, key: string) {
        return bool(value, rules, key);
    }
    return decoratorFactory(check);
}
