import {
  AbstractDataType,
  AbstractDataTypeConstructor,
  ArrayDataType,
  BigIntDataType,
  BlobDataType,
  DateDataType,
  DecimalDataType,
  DoubleDataType,
  EnumDataType,
  FloatDataType,
  GeometryDataType,
  IntegerDataType,
  ModelAttributeColumnOptions,
  RangeableDataType,
  RangeDataType,
  RealDataType,
  StringDataType,
  TextDataType,
} from 'sequelize/types';
import Logger from './logger';

export const parseString = (type: StringDataType) => {
  const extraBinary = type.options?.binary ? `,true` : '';
  const extra = type.options?.length
    ? `(${type.options?.length}${extraBinary})`
    : '';
  return `Sequelize.STRING${extra}`;
};

export const parseTextDateBlob = (
  type: TextDataType | DateDataType | BlobDataType,
) => {
  const extra = type.options?.length
    ? `(${
        typeof type.options?.length === 'string'
          ? `'${type.options?.length}'`
          : type.options?.length
      })`
    : '';
  return `Sequelize.${type.constructor.name}${extra}`;
};

export const parseBigIntInteger = (type: BigIntDataType | IntegerDataType) => {
  const unsigned = type.options?.unsigned ? `.UNSIGNED` : '';
  const zerofill = type.options?.zerofill ? `.ZEROFILL` : '';
  const length = type.options?.length ? `(${type.options?.length})` : '';
  return `Sequelize.${type.constructor.name}${length}${unsigned}${zerofill}`;
};

export const parseFloatRealDouble = (
  type: FloatDataType | RealDataType | DoubleDataType,
) => {
  if (type.options?.decimals && !type.options?.length) {
    Logger.warn(
      `Type ${type.constructor.name} must have length to use decimals. Cannot find length, use plain ${type.constructor.name} instead.`,
    );
  }
  const decimals = type.options?.decimals ? `,${type.options?.decimals}` : '';
  const extra = type.options?.length
    ? `(${type.options?.length}${decimals})`
    : '';
  return `Sequelize.${type.constructor.name}${extra}`;
};

export const parseDecimal = (type: DecimalDataType) => {
  if (type.options?.scale && !type.options?.precision) {
    Logger.warn(
      `Type ${type.constructor.name} must have precision to use scale. Cannot find precision, use plain ${type.constructor.name} instead.`,
    );
  }
  const scale = type.options?.scale ? `,${type.options?.scale}` : '';
  const extra = type.options?.precision
    ? `${type.options?.precision}${scale}`
    : '';
  return `Sequelize.DECIMAL(${extra})`;
};

export const parseGeometry = (type: GeometryDataType) => {
  const scrid = type.options?.srid ? `,${type.options?.srid}` : '';
  const extra = type.options?.type ? `(${type.options?.type}${scrid})` : '';
  return `Sequelize.GEOMETRY${extra}`;
};

export const parseArray = <T extends AbstractDataType>(
  type: ArrayDataType<T>,
) => {
  const typeToParse =
    type.options?.type instanceof Function
      ? type.options?.type()
      : type.options?.type;
  const extra = parseDataType(typeToParse);
  return `Sequelize.ARRAY(${extra})`;
};

export const parseRange = <T extends RangeableDataType>(
  type: RangeDataType<T>,
) => {
  const extra = type.options?.subtype
    ? `(${parseDataType(type.options?.subtype)})`
    : '';
  return `Sequelize.RANGE${extra}`;
};

export const parseEnum = <T extends string>(type: EnumDataType<T>) => {
  return `Sequelize.ENUM('${type.options.values.join("', '")}')`;
};

export const parseDataType = (
  type: AbstractDataTypeConstructor | RangeableDataType,
): string => {
  switch (type.constructor.name) {
    case 'STRING':
      return parseString(type as StringDataType);
    case 'TEXT':
    case 'DATE':
    case 'BLOB':
      return parseTextDateBlob(type as TextDataType);
    case 'BIGINT':
    case 'INTEGER':
      return parseBigIntInteger(type as BigIntDataType);
    case 'FLOAT':
    case 'REAL':
    case 'DOUBLE':
      return parseFloatRealDouble(type as FloatDataType);
    case 'DECIMAL':
      return parseDecimal(type as DecimalDataType);
    case 'GEOMETRY':
      return parseGeometry(type as GeometryDataType);
    case 'ARRAY':
      return parseArray(type as ArrayDataType<any>);
    case 'RANGE':
      return parseRange(type as RangeDataType<any>);
    case 'ENUM':
      return parseEnum(type as EnumDataType<string>);
  }
  return `Sequelize.${type.constructor.name}`;
};

export const extractColumns = (
  fields: string[],
  modelAttribute: ModelAttributeColumnOptions,
) => {
  const out: { [idx: string]: {} } = {};
  for (const [key, value] of Object.entries(modelAttribute)) {
    if (fields.includes('type') && key === 'type') {
      out[key] = parseDataType(value);
      continue;
    }
    if (fields.includes(key)) {
      out[key] = value;
    }
  }
  return out;
};
