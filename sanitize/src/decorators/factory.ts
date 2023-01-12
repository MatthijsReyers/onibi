

/**
 * Reusable decorator factory, takes in a check function that is responsible 
 * for throwing any needed errors and enforcing the constraints provided by 
 * the decorator.
 * 
 * @param {Function} check: Checking 
 * @returns {Function} decorator
 */
export function decoratorFactory(check:(val:any, key:string) => any)
{
    return (target: object, propertyKey: string|symbol) => {
        // Value variable, this will actually store the variable if the old 
        // variable needs to be overwritten with a getter/setter obj.
        let value: number|null;

        // Check if the target property was already assigned a getter and a 
        // setter, in which case we do not want to overwrite the old setter.
        let descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (descriptor !== undefined && !!descriptor['set']) {

            let oldGetter = descriptor.get!;
            let oldSetter = descriptor.set!;

            Reflect.defineProperty(
                target,
                propertyKey,
                {
                    configurable: true,
                    enumerable: true,
                    get: () => oldGetter(),
                    set: (newValue: number) => {
                        oldSetter(check(newValue, String(propertyKey)));
                    }
                }
            );
        }

        // Target is just a pure variable; overwrite it with a getter and a setter obj.
        else Reflect.defineProperty(
            target,
            propertyKey,
            {
                configurable: true,
                enumerable: true,
                get: () => value,
                set: (newValue: number) => {
                    value = check(newValue, String(propertyKey));
                }
            }
        );
    }
}