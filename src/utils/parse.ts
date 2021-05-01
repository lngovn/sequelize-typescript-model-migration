import { convertOpSymbolToText } from './convertOpSymbolToText';

export const parseObjectWithSymbols = (target: any, symbols: any[]): string => {
  let str = '';
  for (const symbol of symbols) {
    str = `${str}${parseKeyValue(
      convertOpSymbolToText(symbol),
      target[symbol],
    )}`;
  }

  return str;
};

export const parseObject = (target: any) => {
  let str = ``;
  const symbols = Object.getOwnPropertySymbols(target);
  if (symbols.length > 0) {
    str = parseObjectWithSymbols(target, symbols);
  }
  for (const [k, v] of Object.entries(target)) {
    if (!v) {
      continue;
    }
    str = `${str}${parseKeyValue(k, v)},`;
  }
  return `{${str}}`;
};

export const parseArray = (target: any[]): string => {
  return target
    .map((v) => {
      if (Array.isArray(v)) {
        return parseArray(v);
      }
      if (typeof v === 'object') {
        return parseObject(v);
      }
      if (typeof v === 'string') {
        return `'${v}'`;
      }
      return v;
    })
    .join(',');
};

export const parseKeyValue = (key: string, value: any) => {
  if (typeof value === 'string') {
    return `${key}:${
      (key === 'type' && value.startsWith('Sequelize')) || key === 'where'
        ? `${value}`
        : `'${value}'`
    }`;
  }

  if (Array.isArray(value)) {
    return `${key}:[${parseArray(value)}]`;
  }

  if (typeof value === 'object') {
    return `${key}:${parseObject(value)}`;
  }

  return `${key}:${value}`;
};

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
