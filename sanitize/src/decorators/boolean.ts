
import { boolean, getRule } from './../boolean';

function Bool() {
    // console.log(target, propertyKey, descriptor)
    let val: any;
    return {
        set: function (value: any) {
            val = value;
            console.log('set', value);
        },
        get: function() {
            return val;
            console.log('get', val);
        },
        enumerable: true,
        configurable: true
    };
};

class Hello {
    @Bool() test = 93;
    
}

