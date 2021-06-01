import migration from '../templates/migration.json';
import createTable from '../templates/create-table.json';
import dropTable from '../templates/drop-table.json';
import addIndex from '../templates/add-index.json';
import removeIndex from '../templates/remove-index.json';
import addForeignKeys from '../templates/add-foreign-key.json';
import removeForeignKeys from '../templates/remove-foreign-key.json';
import addColumn from '../templates/add-column.json';
import removeColumn from '../templates/remove-column.json';
import addUniqueConstraints from '../templates/add-unique-constraints.json';
import removeUniqueConstraints from '../templates/remove-unique-constraints.json';

export const loadMigrationTemplate = () => migration.tpl;

export const loadCreateTableTemplate = () => createTable.tpl;

export const loadDropTableTemplate = () => dropTable.tpl;

export const loadAddIndexTemplate = () => addIndex.tpl;

export const loadRemoveIndexTemplate = () => removeIndex.tpl;

export const loadAddForeignKeysTemplate = () => addForeignKeys.tpl;

export const loadRemoveForeignKeysTemplate = () => removeForeignKeys.tpl;

export const loadAddColumnTemplate = () => addColumn.tpl;

export const loadRemoveColumnTemplate = () => removeColumn.tpl;

export const loadAddUniqueConstraints = () => addUniqueConstraints.tpl;

export const loadRemoveUniqueConstraints = () => removeUniqueConstraints.tpl;

export const loadAllTemplates = (): string[] => {
  return [
    loadMigrationTemplate(),
    loadCreateTableTemplate(),
    loadDropTableTemplate(),
    loadAddIndexTemplate(),
    loadRemoveIndexTemplate(),
    loadAddForeignKeysTemplate(),
    loadRemoveForeignKeysTemplate(),
    loadAddColumnTemplate(),
    loadRemoveColumnTemplate(),
    loadAddUniqueConstraints(),
    loadRemoveUniqueConstraints(),
  ];
};
