 


# introspector

![](https://img.shields.io/badge/introspector-v1.0.0-green.svg) ![](https://img.shields.io/badge/tests-passing-green.svg) ![](https://img.shields.io/badge/statements--coverage-100%25-green.svg) ![](https://img.shields.io/badge/branches--coverage-100%25-green.svg) ![](https://img.shields.io/badge/functions--coverage-100%25-green.svg) ![](https://img.shields.io/badge/lines--coverage-100%25-green.svg) 

Introspector can help to access nested properties 
through custom property selectors and to iterate 
through object, array, string or function properties, 
all of them through the same intuitive and flexible
way.

## 1. Installation

~$ `npm install --save introspector`

## 2. Get started

### Import the module.

#### a) Import the module in Node.js:

```js
const { Introspector, Inspectable } = require("introspector");
```

#### b) Import the module in browsers:

In your HTML:

```
<script src="node_modules/introspector/dist/introspector.js"></script>
```

In your JS:

```js
const { Introspector, Inspectable } = IntrospectorAPI;
```

### 2.2. Create new `Inspectable`s with `Introspector.from(...)`


```js
const inspectable = Introspector.from([1,2,4,8]);
```


### 2.3. Use the `get`, `set`, `force` or `iterate` methods freely

This is a full example of the API:

```js
const value0 = inspectable.get(0); // > 1
const value1 = inspectable.get(1); // > 2
const value2 = inspectable.get(2); // > 4
const value3 = inspectable.get(3); // > 8
const value4 = inspectable.get(4); // > undefined
const value5 = inspectable.get(5, null); // > null
// Example with Inspectable#set(...)
const set1 = inspectable.set(4, 16);
const set2 = inspectable.set(5, 32);
const set_value1 = inspectable.get(4); // > 16
const set_value2 = inspectable.get(5); // > 32
// Example with Inspectable#force(...)
const force1 = inspectable.force(6, 64);
const force2 = inspectable.force("6.a", 128);
const force3 = inspectable.force("6.b", 256);
const force_value1 = inspectable.get(6); // > { $:64, a:128, b:256 }
const force_value2 = inspectable.get("6.a"); // > 128
const force_value3 = inspectable.get("6.b"); // > 256
// Example with Inspectable#iterate(...)
const iterate1 = inspectable.iterate((v,k,i,r,o) => r + (typeof v === "number" ? v : 0), 0) // > 1+2+4+8+16+32
const iterate2 = inspectable.iterate((v,k,i,r,o) => {});
```

And with chai, you can confirm the values so:

```js
expect(value0).to.deep.equal(1);
expect(value1).to.deep.equal(2);
expect(value2).to.deep.equal(4);
expect(value3).to.deep.equal(8);
expect(value4).to.deep.equal(undefined);
expect(value5).to.deep.equal(null);
expect(set_value1).to.deep.equal(16);
expect(set_value2).to.deep.equal(32);
expect(force_value1).to.deep.equal({ $:64, a:128, b:256 });
expect(force_value2).to.deep.equal(128);
expect(force_value3).to.deep.equal(256);
expect(iterate1).to.deep.equal(1+2+4+8+16+32);
```

## 3. API reference

----

### `Inspectable`


**Type:** `{Class}`

**Description:** Object that can be inspected with member methods.




 


----

### `Inspectable.OPTIONS`


**Type:** `{Object:Static property}`

**Description:** Default options for each `Inspectable` instance.




 


----

### `Inspectable.Error`


**Type:** `{Class:Error}`

**Description:** Error for Inspectable processes.

**Parameter:** `{String} name`. *Required*. Name of the error.

**Parameter:** `{String} message`. *Required*. Message of the error.

**Parameter:** `{Any} data`. *Optional*. Data attached to the error.

**Returns:** `{Object:Error}`





 


----

### `new Inspectable(Object:data, Object:options)`


**Type:** `{Function:Constructor}`

**Description:** Constructor for the `Inspectable` class.

**Parameter:** `{Object} data`. *Required*. Data to be inspected.

**Parameter:** `{Object} options`. *Optional*. Options of the current `Inspectable` instance.

**Returns:** `{Object:Inspectable}`




 


----

### `Inspectable#get(String:selector, Any:defaultValue = undefined)`


**Type:** `{Function:Class method}`

**Description:** It retrieves the selected value from `Inspectable#data`, or the `defaultValue` by default.
The `selector` is simply a string containing all the names of the accessed properties, by order, and separated
by the token specified at `Inspectable.options.splitter`, which by default is simply `"."`.

This means that from: 

```js
{
 a: {
   b: {
     c: {
       d: 500
     }
   }
 }
}
```

...getting `"a.b.c.d"` would return `500`.

When a specified property is not accessible, it will return the `defaultValue`.
which by default is `undefined`.


**Parameter:** `{String} selector`. *Required*. Selector to be retrieved from the `Inspectable.data`.

**Parameter:** `{Any} defaultValue`. *Optional*. Default value returned when the operation fails.

**Returns:** `{Any}`




 


----

### `Inspectable#set(String:selector, Any:value)`


**Type:** `{Function:Class method}`

**Description:** It changes the value of a selected property from `Inspectable#data` to the passed `value`.
The `selector`'s syntax is the same explained at `Inspectable#get(...)`.
When a specified property is not accessible, it will simply desist the operation.

For example, this will work:

```js
var inspectable = Inspector.from({a:{b:100}});
inspectable.set("a.c", 200);
```

And now:

```js
inspectable.get("a.c"); // > 200
```

But for example, this will not work:

```js
var inspectable = Inspector.from({a:{b:100}});
// inspectable.set("a.c", {}); // This line should be uncommented for this example to work okay
inspectable.set("a.c.d", 200);
```

This second operation would imply to override values that already exist. The `Inspectable#set(...)` method
will not throw errors when it cannot complete the operation. Instead, it will return `undefined`.

When the operation was accomplished successfully, this method will return the `Inspectable` instance itself.


**Parameter:** `{String} selector`. *Required*. Property selector from the `Inspectable.data`.

**Parameter:** `{Any} value`. *Required*. New value for the selected property.

**Returns:** `{Inspectable | undefined}`




 


----

### `Inspectable#force(String:selector, Any:value)`


**Type:** `{Function:Class method}`

**Description:** This method works the same way that `Inspectabl#set(...)` does, but instead of returning `undefined`
when the properties specified are not accessible (or already created with non-accessible values), this method will
set a new object in the accessible property (and it will set the previous value into the property name specified at 
`Inspectable#options.overridenProperty`, which by default is `$`).

So, for example:

```js
var inspectable = Inspector.from({a:800}).force("a.b", 400);
inspectable.get("a.$"); // > 800
inspectable.get("a.b"); // > 400
```


**Parameter:** `{String} selector`. *Required*. Property selector to be (forcedly) set.

**Parameter:** `{Any} value`. *Required*. New value for the property specified.

**Returns:** `{Inspectable | undefined}`




 


----

### `Inspectable#iterate(Function:fn, Any:initial = undefined)`


**Type:** `{Function:Class method}`

**Description:** This method iterates through an array, object, string or function properties
and applies the passed callback with the following parameters:

For example, you can use the method so:

```js
Inspector.from({a:1,b:2,c:4,d:8}).iterate((v,k,i,r,o) => r + v, 0); // > 15
Inspector.from([1,2,4,8]).iterate((v,k,i,r,o) => r + v, 0); // > 15
Inspector.from("1248").iterate((v,k,i,r,o) => r + parseInt(v), 0); // > 15
```

Where the arguments `(v,k,i,r,o) => {...}` mean:

 · `v`: `value`. Value of the current item.

 · `k`: `key`. In objects and functions, the name of the property of the current item. In arrays and strings, the index of the current item.

 · `i`: `index`. The number of the current iteration.

 · `r`: `result`. The returned value (accumulative, it can be modified by making the iterator return some value other than `undefined`).

 · `o`: `original`. The original object/array/string/function.

And where the second parameter, `0` is the initial value as result.

The parameters provided are 2: the callback of the iteration (reductor), and the initial value returned.

The initial value returned is passed as `result` to the callback. Internally, if the callback returns
something other than `undefined` (or nothing), this value is taken as the new `result`, and will be passed 
as so to the next callback call. Where the iterations are done, the last value of the `result` will be passed.

This mechanism lets the developer play with the `reduction` functionality to customize the output of this
method. Easily, one can emulate the `map` and `filter` functionality, but without caring about the input's type,
and having full control of the output's structure and content.


**Parameter:** `{Function} fn`. *Required*. Callback to be applied as iterator. 
This function receives: `(value, key, index, result, original)`.
When this function returns something other than `undefined`, this value is 
understood as the value to be returned by the whole iteration. This way, one
can emulate `map`, `filter` or `reduce` effortlessly.

**Parameter:** `{Any} initial`. *Optional*. First value.

**Returns:** `{Inspectable | Any}`. By default, it returns the `Inspectable` instance itself, 
but when the `fn` call returns something other than `undefined`, it understands that this
returned value is the new `result`, and the last value it takes is the value it finally 
returns.




 


----

### `Introspector`


**Type:** `{Class}`

**Description:** This (abstract) class instantiates fresh `Inspectable` instances through `Inspector.from(data, options)`.




 


----

### `Introspector.from(Object|Array|String|Function:data, options:Object = {})`


**Type:** `{Function:Static method}`

**Description:** This method returns a fresh `Inspectable` instance from the `data` and `options` provided.

**Parameter:** `{Object|Array|String|Function} data`. *Required*. Data to be inspectable.

**Parameter:** `{Object} options`. *Optional*. By default: `{}`.

**Returns:** `{Object:Inspectable}`






 



## 4. Commands of the project

### To build:

~$ `npm run build`

### To test:

~$ `npm run test`

### To generate coverage reports:

~$ `npm run coverage`

### To generate documentation:

~$ `npm run docs`



## 5. Conclusion

This module that works the same way in browsers or Node.js environments can:

 · Deal with arrays and objects' iterations the same way

 · Unlock property deep-accessing with an intuitive, customizable syntax

 · Improve readability of the code in general







