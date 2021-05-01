import { ModelAttributeColumnOptions } from "sequelize/types";
import { extractColumns } from "./parseDataType";

export const getColumnsAttribute = (modelAttribute: ModelAttributeColumnOptions) => {
  return {
    [modelAttribute.field!]: extractColumns(
      [
        'type',
        'allowNull',
        'unique',
        'primaryKey',
        'autoIncrement',
        'autoIncrementIdentity',
        'comment',
        'validate',
      ],
      modelAttribute,
    ),
  };
};
