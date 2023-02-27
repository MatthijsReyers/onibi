import { IntegerSanitizerRules, RangedIntSanitizerRules, UnsignedIntSanitizerRules } from './../integer.types';
import { decoratorFactory } from './factory';
import int from './../integer';

export function SignedInt(rules?: Partial<IntegerSanitizerRules>)
{
    function check(value: any, key: string) {
        return int.signed(value, rules, key);
    }
    return decoratorFactory(check);
}

export function UnSignedInt(rules?: Partial<UnsignedIntSanitizerRules>)
{
    function check(value: any, key: string) {
        return int.unsigned(value, rules, key);
    }
    return decoratorFactory(check);
}

export function RangedInt(min: number, max: number, rules?: Partial<RangedIntSanitizerRules>)
{
    function check(value: any, key: string) {
        return int.ranged(value, min, max, rules, key);
    }
    return decoratorFactory(check);
}
