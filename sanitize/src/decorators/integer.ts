import { IntegerSanitizerRules, RangedIntSanitizerRules, UnsignedIntSanitizerRules } from './../integer.types';
import { decoratorFactory } from './factory';
import int from './../integer';
import { Field } from '../field';

export function SignedInt(rules?: Partial<IntegerSanitizerRules>)
{
    function check(value: any, key: string) {
        const rulesWithField: Partial<IntegerSanitizerRules & Field> = Object.assign({}, rules || {}); 
        rulesWithField['field'] = key;
        return int.signed(value, rulesWithField);
    }
    return decoratorFactory(check);
}

export function UnSignedInt(rules?: Partial<UnsignedIntSanitizerRules>)
{
    function check(value: any, key: string) {
        const rulesWithField: Partial<UnsignedIntSanitizerRules & Field> = Object.assign({}, rules || {}); 
        rulesWithField['field'] = key;
        return int.unsigned(value, rulesWithField);
    }
    return decoratorFactory(check);
}

export function RangedInt(min: number, max: number, rules?: Partial<RangedIntSanitizerRules>)
{
    function check(value: any, key: string) {
        const rulesWithField: Partial<RangedIntSanitizerRules & Field> = Object.assign({}, rules || {}); 
        rulesWithField['field'] = key;
        return int.ranged(value, min, max, rulesWithField);
    }
    return decoratorFactory(check);
}
