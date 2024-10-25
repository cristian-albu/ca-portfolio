import pgPool from "../../services/pgPool";
import { DataTypes, T_Attributes, T_ManyToManyAttribute } from "../types";

export default abstract class QueryHandler {
  static async handleClientQuery(query: string, args?: string[]) {
    const client = await pgPool.connect();

    try {
      await client.query("BEGIN");
      const result = await client.query(query, args ? [...args] : []);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async createEnumType(enumName: string, values: string[]) {
    const checkEnumTypeQuery = `
      SELECT 1 
      FROM pg_type 
      WHERE typname = $1
    `;
    const result = await pgPool.query(checkEnumTypeQuery, [enumName]);

    if (result.rowCount === 0) {
      const enumTypeDefinition = `
        CREATE TYPE ${enumName} AS ENUM(${values.map((value) => `'${value}'`).join(", ")});
      `;
      await this.handleClientQuery(enumTypeDefinition);
    }
  }

  static async buildManyToManyTableQuery(data: T_ManyToManyAttribute) {
    const joinTableName = `${data.table1}_${data.table2}`;
    const t1id = `${data.table1}_id`;
    const t2id = `${data.table2}_id`;

    const query = `CREATE TABLE IF NOT EXISTS ${joinTableName}(
        ${t1id} uuid REFERENCES ${data.table1}(${data.id1}),
        ${t2id} uuid REFERENCES ${data.table2}(${data.id2}),
        PRIMARY KEY (${t1id}, ${t2id})
    );`;

    const index1 = `CREATE INDEX IF NOT EXISTS idx_${t1id} ON ${joinTableName}(${t1id});`;
    const index2 = `CREATE INDEX IF NOT EXISTS idx_${t2id} ON ${joinTableName}(${t2id});`;

    await this.handleClientQuery(query);
    await Promise.all([this.handleClientQuery(index1), this.handleClientQuery(index2)]);
  }

  static async buildTableQuery<T extends Record<string, unknown>>(tableName: string, attributes: T_Attributes<T>) {
    const enumAttributes = Object.values(attributes).filter((attr) => attr.type === DataTypes.ENUM);

    for (const enumAttr of enumAttributes) {
      await QueryHandler.createEnumType(enumAttr.name, enumAttr.values);
    }

    const columns = Object.entries(attributes).map(([_, value]) => {
      const { name, notNull } = value;
      let columnDef = `${name} `;

      switch (value.type) {
        case DataTypes.BOOL:
          columnDef += `BOOLEAN`;
          if (value.default !== undefined) {
            columnDef += ` DEFAULT ${value.default}`;
          }
          break;

        case DataTypes.INT:
          columnDef += `INT`;
          if (value.default !== undefined) {
            columnDef += ` DEFAULT ${value.default}`;
          }
          break;

        case DataTypes.UUID:
          columnDef += `uuid`;
          if (value.primary_key) {
            columnDef += ` PRIMARY KEY`;
          }
          break;

        case DataTypes.TIMESTAMP:
          columnDef += `TIMESTAMP`;
          if (value.default) {
            columnDef += ` DEFAULT CURRENT_TIMESTAMP`;
          }
          break;

        case DataTypes.ENUM:
          columnDef += `${value.name}`;

          if (value.default) {
            columnDef += ` DEFAULT '${value.default}'`;
          }
          break;

        case DataTypes.VARCHAR:
          columnDef += `VARCHAR(${value.size})`;
          if (value.unique) {
            columnDef += ` UNIQUE`;
          }
          break;

        case DataTypes.TEXT:
          columnDef += `TEXT`;
          break;

        case DataTypes.JSON:
          columnDef += `JSON`;
          break;

        case DataTypes.ONE_TO_ONE:
          columnDef = `${value.table}_id uuid UNIQUE REFERENCES ${value.table}(${value.id})`;
          break;

        case DataTypes.ONE_TO_MANY:
          columnDef = `${value.table}_id uuid REFERENCES ${value.table}(${value.id})`;
          break;

        case DataTypes.MANY_TO_MANY:
          break;

        default:
          throw new Error(`Unsupported attribute type`);
      }

      if (notNull) {
        columnDef += ` NOT NULL`;
      }

      return columnDef;
    });

    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(", ")});`;

    return query;
  }
}
