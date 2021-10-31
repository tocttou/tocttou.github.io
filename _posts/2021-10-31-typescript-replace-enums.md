---
title: Alternative to enums in Typescript
published: true
---

Sometimes when adding types to an existing codebase it becomes difficult to use Enums when you want to type something that should have been an Enum.

Consider the following component:

```jsx
const FilterComponent = ({ filterType }) => {
  if (filterType === "CHECKBOX") {
    return <div>Filtered by CHECKBOX</div>;
  } else if (filterType === "RADIO") {
    return <div>Filtered by RADIO</div>;
  }

  return <div>Not filtered</div>;
};

export default FilterComponent;
```

The component is used like this in the existing codebase:

```js
<FilterComponent filterType="CHECKBOX" />
```

---

If this was a new component, we could represent the values `filterType` can take as an Enum:

```tsx
export enum FilterOptions {
  CHECKBOX = "CHECKBOX",
  RADIO = "CHECKBOX"
}

const FilterComponent = ({ filterType }: { filterType: FilterOptions }) => {
  if (filterType === FilterOptions.CHECKBOX) {
    return <div>Filtered by FilterOptions</div>;
  } else if (filterType === FilterType.RADIO) {
    return <div>Filtered by RADIO</div>;
  }

  return <div>Not filtered</div>;
};

export default FilterComponent;
```

Which can then be used as:

```tsx
<FilterComponent filterType={FilterOptions.CHECKBOX} />
```

---

But because this is an existing component, typing `filterType` with an Enum would mean that all usages would need to be changed to use the Enum, because string representation cannot be used. This may not be feasible if the component has been used extensively across the codebase.

```tsx
// the following code gives a typeerror if filterType is an enum

<FilterComponent filterType="CHECKBOX" />

// Type 'string' is not assignable to type 'FilterType'
```

---

We would ideally want to type it in a way that is backwards compatible with usage as a `string` and can also be used as a choice between some pre-defined options.

One way to do this is by changing the Enum to an object, and using the keys of the object for defining the type. This can be done combining the `keyof` and `typeof` operators.

```tsx
export const FilterOptions = {
  CHECKBOX: "CHECKBOX",
  RADIO: "RADIO"
};

type TFilterType = keyof typeof FilterOptions;

// TFilterType is: CHECKBOX | RADIO

const FilterComponent = ({ filterType }: { filterType: TFilterType }) => {
  if (filterType === FilterOptions.CHECKBOX) {
    return <div>Filtered by FilterOptions</div>;
  } else if (filterType === FilterType.RADIO) {
    return <div>Filtered by RADIO</div>;
  }

  return <div>Not filtered</div>;
};

export default FilterComponent;
```

Which can then be used as:

```tsx
<FilterComponent filterType="CHECKBOX" />

// or

<FilterComponent filterType={FilterOptions.CHECKBOX} />

// both are valid usages
```

---

But `TFilterType` now depends upon the fact that the key and value pairs in `FilterOptions` are the same literals. So the following will not work (note the key, value pairs in `FilterOptions` are different literals):

```tsx
export const FilterOptions = {
  CHECKBOX: "checkbox",
  RADIO: "radio"
};

type TFilterType = keyof typeof FilterOptions;

// TFilterType is: CHECKBOX | RADIO

const FilterComponent = ({ filterType }: { filterType: TFilterType }) => {
  if (filterType === FilterOptions.CHECKBOX) {
    return <div>Filtered by FilterOptions</div>;
  } else if (filterType === FilterType.RADIO) {
    return <div>Filtered by RADIO</div>;
  }

  return <div>Not filtered</div>;
};

export default FilterComponent;
```

For the usage:

```js
// this usage does not give a type error but is incorrect in code
<FilterComponent filterType="CHECKBOX" />

// this usage gives a type error but is correct in code
// Type '"checkbox"' is not assignable to type '"CHECKBOX" | "RADIO"'
<FilterComponent filterType={FilterOptions.CHECKBOX} />
```

Enforcing that the key and value are the same literal is a challenge of its own. We can do better.

---

We can define an indexed access type `ValueOf`, which will work just like the `keyof` operator but the type will be a union of the object values instead of keys.

```tsx
type ValueOf<T> = T[keyof T];

export const FilterOptions = {
  CHECKBOX: "checkbox",
  RADIO: "radio"
} as const;

type TFilterType = ValueOf<FilterOptions>;

const FilterComponent = ({ filterType }: { filterType: TFilterType }) => {
  if (filterType === FilterOptions.CHECKBOX) {
    return <div>Filtered by FilterOptions</div>;
  } else if (filterType === FilterType.RADIO) {
    return <div>Filtered by RADIO</div>;
  }

  return <div>Not filtered</div>;
};

export default FilterComponent;
```

Which can be used as:

```tsx
<FilterComponent filterType="checkbox" />

// or

<FilterComponent filterType={FilterOptions.CHECKBOX} />

// both are valid usages
```

Note the explicit [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on `FilterOptions`. Without this assertion typescript would lose literal values and put `TFilterType` as just `string` - which is not useful here as `<FilterComponent filterType="checkmate" />` would not raise any type errors!