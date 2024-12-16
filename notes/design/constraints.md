# auto layout constraints

- define arbitrary relationship between two views
- the views don't have to be siblings
- multiple constraints can exist for a single attribute

## render prop

### centering

```jsx
<view>
  {(constraints) => (
    <label centerX={constraints.centerX} centerY={constraints.centerY}>
      hello there, friend
    </label>
  )}
</view>
```

- too heavy
- would need to prop drill constraints
  - although maybe that's doing it wrong
- only works when you own the parent view

## `<constraints>`

### centering

```jsx
<view>
  <constraints centeredX centeredY>
    <label>hello there, friend</label>
  </constraints>
</view>
```

- ???
- label needs to refer to view, but that's not obvious (is it the parent of
  `<constraints>` that's the source?)

### sequence

```jsx
function Showcase({cool, cool2}) {
  return (
    <stack vertical>
      <constraints centeredX>
        <label>this is cool:</label>
        {cool}
        <label>this is also cool:</label>
        {cool2}
      </constraints>
    </stack>
  );
}
```

- this only works for direct children
- label1.centerX = cool.centerX
- cool.centerX = label2.centerX
- label2.centerX = cool2.centerX
- seems precarious

## like refs

```jsx
const constraint = useConstraint();

return (
  <view centerX={constraint} centerY={constraint}>
    <label centerX={constraint} centerY={constraint} />
  </view>
);
```

- effectively: `view.centerX = label.centerX`, `view.centerY = label.centerY` (or vice versa)

```jsx
const constraint = useConstraint();

return (
  <stack horizontal>
    <button height={constraint}>foo</button>
    <button height={constraint.add(20)}>foo but 20 points taller</button>
  </stack>
);
```

- have to enforce that constraint can only be applied to two elements...

## as props

```jsx
return (
  <stack horizontal>
    <constraint
      first={<button>foo</button>}
      second={<button>foo but 20 points taller</button>}
      attribute='height'
    />
  </stack>
);
```

- too heavy
- have to type out `attribute=`

```jsx
return (
  <stack horizontal>
    <constrain.height
      first={<button>foo</button>}
      second={<button>foo but 20 points taller</button>}
    />
  </stack>
);
```

- hmm, better
- ok, so turns out children can be an array or tuple (which can help w/ enforcing 2 only)
- ... same as `<constraints>`, basically. children are props
- **can't express second being a child of first**

how to express view in `NSBox` having 20pt margins with its parent?

```jsx
<constrain.space constant={20} parent={box} parentProps={type: 'custom', fillColor: 'red'}>
  hi
</constrain.space>
```

- feels wrong. plus makes it harder to dynamically set `isActive` of constraint
  since it's responsible for rendering the views, too. constraint should be
  standalone object. but that leads to verbosity

hmm

```jsx
const C = useConstraints({
  top: 10,
  leading: 10,
});

return (
  <box type='custom' fillColor='red' {...C}>
    <label {...C}>hi</label>
  </box>
);
```

- `label.top = box.top + 10`, `label.leading = box.leading + 10`
  - this ordering is unclear, why not `box.top = label.top + 10`, etc.
- almost feels like `NSLayoutConstraint.activate`
- problem of: what happens if `{...C}` applied to more than 2 components?
- `useConstraints` returns object with unique keys that cannot clash (bc passed as props)

something like _this_ is ideal:

```jsx
<box type='custom' fillColor='red'>
  <label top={box.top + 10} leading={box.leading + 10}>
    hi
  </label>
</box>
```

## refs (again)

cursed:

```jsx
function App() {
  const views = useViews();

  return (
    <window title='hello, capstone'>
      <view ref={views.container}>
        <label ref={views.label}>nice</label>
      </view>

      <constraint>
        {views.container.width}={300}
      </constraint>
      <constraint>
        {views.container.height}={300}
      </constraint>
      <constraint>
        {views.container.centerX} = {views.container.centerX}
      </constraint>
      <constraint>
        {views.container.centerY} = {views.container.centerY}
      </constraint>
    </window>
  );
}
```

- use proxies
- strongly type `props.children` to only accept valid constraints
- but i don't like typing `</constraint>`

```jsx
function App() {
  const views = useViews();

  return (
    <window title='hello, capstone'>
      <view ref={views.container}>
        <label ref={views.label}>nice</label>
      </view>

      {/* equiv: <constraint relating={views.container.width} equalTo={300} /> */}
      <constraint.width view={views.container} constant={300} />
      <constraint.height view={views.container} constant={300} />
      <constraint
        relating={views.container.centerX}
        equalTo={views.container.centerX}
      />
      <constraint
        relating={views.container.centerX}
        equalTo={views.container.centerY}
      />
    </window>
  );
}
```
