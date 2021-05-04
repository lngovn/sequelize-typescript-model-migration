# sequelize-typescript-model-migration

Auto-generate migration script from sequelize-typescript model.

**This refers to [GitHub - kimjbstar/sequelize-typescript-migration](https://github.com/kimjbstar/sequelize-typescript-migration).**

This scans models and its decorators by [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) to find changes, and generates migration code with this changes so don't need to write up, down function manually. this is like "makemigration" in django framework.

After generate successfully, you can use "migrate" in [Sequelize](https://sequelize.org/)
[Sequelize Migration Manual](https://sequelize.org/master/manual/migrations.html).

This also resolve some issues which left for sometimes in the sequelize-typescript-migration, such as:

1. [@Index not working](https://github.com/kimjbstar/sequelize-typescript-migration/issues/7)
2. [[SequelizeDatabaseError]: relation "sequelizemeta" does not exist](https://github.com/kimjbstar/sequelize-typescript-migration/issues/4)
3. Table options `underscore:true` doesn not work with Index fields.

And also add some enhancement, such as:

1. Upgrade version of sequelize-typescript depedencies to 2.x and version of sequelize to 6.x
2. Create snapshot files to store latest state instead of adding to SequelizeMetaMigration table.
3. Add prettier options to format the generated migration files.

## Installation

```
npm i -D sequelize-typescript-model-migration
```

## Usage Example

```typescript
import { Sequelize } from "sequelize-typescript";
import { generateMigration } from "sequelize-typescript-model-migration";
import prettierOptions from '.prettierrc.json';

const sequelize: Sequelize = new Sequelize(database, username, password,
    {
      // other options
      ...
      //load sequelize-typescript models into sequelize
      models: [path.join(__dirname, '/models')]
    }
});

await generateMigration(sequelize, {
    outDir: path.join(__dirname, "../migrations"),
    snapshotDir: path.join(__dirname, "../snapshots")
    migrationName: "my-migration-file",
    prettierOptions,
});
```

Please refer this [example](https://github.com/lngovn/sequelize-typescript-model-migration/tree/main/example) for more information.

## Documentation

not ready yet.
