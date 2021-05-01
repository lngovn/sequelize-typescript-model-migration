import {
  loadCreateTableTemplate,
  loadDropTableTemplate,
} from './loadTemplates';

export const genCreateTableCommand = (tableName: string, columns: {}) => {
  let modelText = '';
  for (const [k, v] of Object.entries(columns)) {
    let str = '';
    for (const [kk, vv] of Object.entries(v as {})) {
      str = `${str}${kk}:${
        typeof vv === 'object'
          ? JSON.stringify(vv)
          : kk !== 'onDelete' && kk !== 'onUpdate'
          ? vv
          : `'${vv}'`
      },`;
    }
    modelText = `${modelText}${k}:{${str}},`;
  }
  return loadCreateTableTemplate()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{tableProperties}', `{${modelText}}`);
};

export const genDropTableCommand = (tableName: string) => {
  return loadDropTableTemplate().replace('{tableName}', `'${tableName}'`);
};
