import { Http422Error, ToHttpError } from "@onibi/errors";

export class SanitizerError extends Error implements ToHttpError
{
    name: string;
    description: string;

    constructor(name: string, description: string)
    {
        super(description);
        this.name = name;
        this.description = description;
    }

    public toHttpError(): Http422Error
    {
        return new Http422Error()
    }
}

export class InvalidUuidError extends SanitizerError
{
    constructor(value: string, field?: string) 
    {
        if (field) super(`Invalid UUID`, `Received value '${value}' for field '${field}' was not a valid UUID.`);
        else super(`Invalid UUID`, `Received value '${value}' was not a valid UUID.`);
    }

    public override toHttpError() 
    {
        // TODO !!!!!!!!!!!!!!!!!!!!!!!!!
        return new Http422Error('422InvalidUuid', this.name, this.description);
    }
}

export class InvalidEmailError extends SanitizerError
{
    private field?: string;
    private value?: string;

    constructor(value: string, field?: string) 
    {
        if (field)
            super(`Invalid Email Address`, `Received value '${value}' for field '${field}' was not a valid email address.`);
        else super(`Invalid Email Address`, `Received value '${value}' was not a valid email address.`);
        this.field = field;
        this.value = value;
    }

    public override toHttpError() 
    {
        // TODO !!!!!!!!!!!!!!!!!!!!!!!!!
        return new Http422Error('422InvalidEmail', 'Invalid Email Address', 'Provided string was not an email.');
    }
}

export class UnexpectedValueError extends SanitizerError
{
    private field?: string;
    private value?: string;

    constructor(field?: string, value?: string) 
    {
        if (field !== undefined && value !== undefined) 
            super(`Unexpected value`, `Received unexpected value '${value}' for field '${field}'.`);
        else if (field !== undefined)
            super(`Unexpected value`, `Received unexpected value for field '${field}'.`);
        else if (value !== undefined)
            super(`Unexpected value`, `Received unexpected value '${value}'.`);
        else super(`Unexpected value`, `Received unexpected value.`);
        this.field = field;
        this.value = value;
    }

    public override toHttpError() 
    {
        if (this.value)
            return new Http422Error('422UnexpectedValue', 'Unexpected value', `Received unexpected value '${this.value}' for field '${this.field}'.`);
        if (this.field)
            return new Http422Error('422UnexpectedValue', 'Unexpected value', `Received unexpected value for field: '${this.field}'.`);
        return new Http422Error('422UnexpectedValue', 'Unexpected value', 'Received unexpected value.');
    }
}

export class EnumValueError extends SanitizerError
{
    private field: string | null;

    constructor(values: any[], value: any, field?: string) 
    {
        if (field) super(`Enum value`, `Field '${field}' has unexpected value '${value}', but expected one of [${values}].`);
        else super(`Enum value`, `Found unexpected value '${value}', but expected one of [${values}].`);
        this.field = field || null;
    }

    public override toHttpError() 
    {
        if (this.field)
            return Http422Error.withNullField(this.field);
        return new Http422Error('422EnumValue', 'Enum value', `Unexpected value for field '${this.field}'.`);
    }
}

export class NullValueError extends SanitizerError
{
    private field: string | null;

    constructor(field?: string) 
    {
        if (field) super(`Null value`, `Field '${field}' cannot be null.`);
        else super(`Null value`, `Value cannot be null.`);
        this.field = field || null;
    }

    public override toHttpError() 
    {
        if (this.field)
            return Http422Error.withNullField(this.field);
        return new Http422Error('422NullValue', 'Null value', 'Unexpected null value.');
    }
}

export class InfiniteValueError extends SanitizerError
{
    private field: string | null;

    constructor(field?: string) 
    {
        if (field) super(`Infinite value`, `Field '${field}' cannot be infinite.`);
        else super(`Infinite value`, `Value must be finite.`)
        this.field = field || null;
    }

    public override toHttpError() 
    {
        if (this.field)
            return Http422Error.withNegativeField(this.field);
        return new Http422Error('422InfiniteValue', 'Infinite value', 'Expected a finite value.');
    }
}

export class NegativeValueError extends SanitizerError
{
    private field: string | null;

    constructor(field?: string) 
    {
        if (field) super(`Negative value`, `Field '${field}' cannot be negative.`);
        else super(`Negative value`, `Value cannot be negative.`)
        this.field = field || null;
    }

    public override toHttpError() 
    {
        if (this.field)
            return Http422Error.withNegativeField(this.field);
        return new Http422Error('422NegativeValue', 'Negative value', 'Unexpected negative value.');
    }
}

export class NanValueError extends SanitizerError
{
    private field: string | null;

    constructor(field?: string) 
    {
        if (field) super(`Not a number`, `Field '${field}' is not a number.`);
        else super(`Not a number`, `Provided values is not a number.`)
        this.field = field || null;
    }

    public override toHttpError() 
    {
        if (this.field)
            return Http422Error.withNegativeField(this.field);
        return new Http422Error('422NotNumber', 'Not a number', 'Unexpected value, not a number.');
    }
}

export class UndefinedValueError extends SanitizerError
{
    private field?: string;

    constructor(field?: string) 
    {
        if (field) super(`Undefined value`, `Missing value for field '${field}', it is not optional.`);
        else super(`Undefined value`, `Value is missing or undefined.`)
        this.field = field;
    }

    public override toHttpError() 
    {
        if (this.field)
            return Http422Error.withMissingField(this.field);
        return new Http422Error(
            '422MissingField',
            'Missing field',
            `Request is missing a field or it is undefined.`,
        );
    }
}
