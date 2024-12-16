export function inspect(thing: any): string {
  if (Number.isNaN(thing)) {
    return 'NaN';
  } else if (thing === null) {
    return '[null]';
  }

  switch (typeof thing) {
    case 'object':
      let output = '';
      if ('is' in thing) {
        // TODO: use symbol instead
        output += `<${thing.is} `;
      } else {
        output += '{';
      }

      for (let key in thing) {
        if (key === 'is') continue;
        output += inspect(key) + ': ' + inspect(thing[key]);
        output += ', ';
      }

      output += 'is' in thing ? '>' : '}';
      return output;
    case 'string':
      return '"' + thing + '"';
    case 'number':
    case 'bigint':
      return String(thing);
    case 'boolean':
      return String(thing);
    case 'function':
      return '[function]';
    case 'undefined':
      return '[undefined]';
    case 'symbol':
      return '[symbol]';
  }
}
