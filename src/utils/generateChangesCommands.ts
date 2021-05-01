import { diff } from 'deep-diff';
import { IExtractedModel, IExtractedModels } from '../types';
import {
  convertObjectToArray,
  revertSanitizeFields,
  sanitizeModelsFields,
} from './createSnapshot';
import {
  genAddColumnCommand,
  genRemoveColumnCommand,
} from './genColumnCommands';
import { generateMigrationCommands } from './genCommands';
import {
  genAddForeignKeyCommand,
  genAddForeignKeysCommands,
  genRemoveForeignKeyCommand,
  genRemoveForeignKeysCommands,
} from './genForeignKeysCommands';
import {
  genAddIndexCommand,
  genAddIndexesCommands,
  genRemoveIndexCommand,
  genRemoveIndexesCommands,
} from './genIndexesCommands';
import { genCreateTableCommand, genDropTableCommand } from './genTableCommands';
import { loadMigrationTemplate } from './loadTemplates';

export const orderCommands = (
  commands: { order: number; cmds: string[] }[] = [],
) =>
  commands
    .sort((a, b) => a.order - b.order)
    .map((v) => v.cmds)
    .reduce((prev, curr) => {
      prev.push(...curr);
      return prev;
    }, []);
export const generateChangesCommands = (
  prevState: IExtractedModels,
  curState: IExtractedModels,
) => {
  const difference: any = diff(prevState, sanitizeModelsFields(curState));
  if (!difference) {
    return '';
  }
  const upCommands: { order: number; cmds: string[] }[] = [];
  const downCommands: { order: number; cmds: string[] }[] = [];

  for (const dif of difference) {
    if (
      dif.rhs === undefined &&
      dif.lhs === undefined &&
      dif.item === undefined
    ) {
      continue;
    }

    switch (dif.kind) {
      case 'N':
        if (dif.path.length === 1) {
          const model: IExtractedModel = dif.rhs;
          upCommands.push({
            order: 0,
            cmds: [genCreateTableCommand(model.name, model.columns)],
          });
          upCommands.push({
            order: 2,
            cmds: genAddForeignKeysCommands(model.name, model.foreignKeys),
          });
          upCommands.push({
            order: 3,
            cmds: genAddIndexesCommands(
              model.name,
              model.options?.underscored,
              model.indexes,
            ),
          });

          downCommands.push({
            order: 0,
            cmds: genRemoveForeignKeysCommands(model.name, model.foreignKeys),
          });

          downCommands.push({
            order: 1,
            cmds: genRemoveIndexesCommands(model.name, model.indexes),
          });

          downCommands.push({
            order: 3,
            cmds: [genDropTableCommand(model.name)],
          });

          break;
        }
        if (dif.path.length > 1 && dif.path[1] === 'columns') {
          upCommands.push({
            order: 1,
            cmds: [genAddColumnCommand(dif.path[0], dif.path[2], dif.rhs)],
          });
          downCommands.push({
            order: 2,
            cmds: [genRemoveColumnCommand(dif.path[0], dif.path[2])],
          });
          break;
        }
        if (dif.path.length > 1 && dif.path[1] === 'indexes') {
          dif.rhs.fields = dif.rhs.fields
            ? convertObjectToArray(dif.rhs.fields)
            : [];
          upCommands.push({
            order: 3,
            cmds: [
              genAddIndexCommand(
                dif.path[0],
                !!curState[dif.path[0]].options?.underscored,
                dif.rhs,
              ),
            ],
          });
          downCommands.push({
            order: 1,
            cmds: [genRemoveIndexCommand(dif.path[0], dif.rhs.name)],
          });
          break;
        }
        if (dif.path.length > 1 && dif.path[1] === 'foreignKeys') {
          upCommands.push({
            order: 2,
            cmds: [genAddForeignKeyCommand(dif.path[0], dif.rhs)],
          });
          downCommands.push({
            order: 0,
            cmds: [genRemoveForeignKeyCommand(dif.path[0], dif.rhs.name)],
          });
        }
        break;
      case 'D':
        if (dif.path.length === 1) {
          upCommands.push({
            order: 4,
            cmds: genRemoveForeignKeysCommands(
              dif.path[0],
              dif.lhs.foreignKeys,
            ),
          });
          upCommands.push({
            order: 5,
            cmds: genRemoveIndexesCommands(dif.path[0], dif.lhs.indexes),
          });
          upCommands.push({
            order: 7,
            cmds: [genDropTableCommand(dif.path[0])],
          });

          downCommands.push({
            order: 2,
            cmds: genAddForeignKeysCommands(
              dif.path[0],
              revertSanitizeFields(dif.lhs.foreignKeys),
            ),
          });
          downCommands.push({
            order: 3,
            cmds: genAddIndexesCommands(
              dif.path[0],
              !!prevState[dif.path[0]]?.options?.underscored,
              revertSanitizeFields(dif.lhs.indexes),
            ),
          });
          downCommands.push({
            order: 0,
            cmds: [genCreateTableCommand(dif.path[0], dif.lhs.columns)],
          });
          break;
        }
        if (dif.path.length > 1 && dif.path[1] === 'indexes') {
          upCommands.push({
            order: 5,
            cmds: [genRemoveIndexCommand(dif.path[0], dif.path[2])],
          });
          downCommands.push({
            order: 3,
            cmds: [
              genAddIndexCommand(
                dif.path[0],
                !prevState[dif.path[0]].options?.underscored,
                revertSanitizeFields({
                  [dif.path[2]]: prevState[dif.path[0]].indexes[dif.path[2]],
                }),
              ),
            ],
          });
          break;
        }
        if (dif.path.length > 1 && dif.path[1] === 'columns') {
          upCommands.push({
            order: 6,
            cmds: [genRemoveColumnCommand(dif.path[0], dif.path[2])],
          });
          downCommands.push({
            order: 1,
            cmds: [genAddColumnCommand(dif.path[0], dif.path[2], dif.lhs)],
          });
          break;
        }
        if (dif.path.length > 1 && dif.path[1] === 'foreignKeys') {
          upCommands.push({
            order: 4,
            cmds: [genRemoveForeignKeyCommand(dif.path[0], dif.path[2])],
          });
          downCommands.push({
            order: 2,
            cmds: [
              genAddForeignKeyCommand(
                dif.path[0],
                revertSanitizeFields({ [dif.lhs.name]: dif.lhs }),
              ),
            ],
          });
          break;
        }
        break;
      case 'E':
        if (dif.path.length > 1 && dif.path[1] === 'indexes') {
          upCommands.push(
            {
              order: 5,
              cmds: [genRemoveIndexCommand(dif.path[0], dif.path[2])],
            },
            {
              order: 3,
              cmds: [
                genAddIndexCommand(
                  dif.path[0],
                  !curState[dif.path[0]].options?.underscored,
                  revertSanitizeFields({
                    [dif.path[2]]: curState[dif.path[0]].indexes[dif.path[2]],
                  }),
                ),
              ],
            },
          );
          downCommands.push(
            {
              order: 5,
              cmds: [genRemoveIndexCommand(dif.path[0], dif.path[2])],
            },
            {
              order: 3,
              cmds: [
                genAddIndexCommand(
                  dif.path[0],
                  !curState[dif.path[0]].options?.underscored,
                  revertSanitizeFields({
                    [dif.path[2]]: prevState[dif.path[0]].indexes[dif.path[2]],
                  }),
                ),
              ],
            },
          );
        }
        break;
    }
  }

  return generateMigrationCommands(
    loadMigrationTemplate(),
    orderCommands(upCommands),
    orderCommands(downCommands),
  );
};
