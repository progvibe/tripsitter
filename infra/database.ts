const mysql = planetscale.getDatabaseOutput({
  name: "tripsitter",
  organization: "progvibe",
});

const branch = planetscale.getBranchOutput({
  name: "main",
  database: mysql.name,
  organization: mysql.organization,
});

const password = new planetscale.Password("DatabasePassword", {
  database: mysql.name,
  organization: mysql.organization,
  branch: branch.name,
  role: "admin",
  name: `${$app.name}-${$app.stage}-credentials`,
});

export const database = new sst.Linkable("Database", {
  properties: {
    username: password.username,
    host: branch.mysqlAddress,
    password: password.plaintext,
    database: password.database,
    port: 5432,
  },
});
