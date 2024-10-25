import QueryHandler from "./queryBuilder";
import { T_Attributes, T_WhereClause } from "../types";

const tableModels: BaseModel<unknown>[] = [];

export default abstract class BaseModel<T> {
  public tableName: string;
  public attributes: T_Attributes<T>;

  constructor({ tableName, attributes }: { tableName: string; attributes: T_Attributes<T> }) {
    this.tableName = tableName;
    this.attributes = attributes;
    tableModels.push(this);
  }

  public async findOne({ whereClause }: { whereClause?: T_WhereClause<T> }) {}

  public async findAll({ whereClause, limit }: { whereClause?: T_WhereClause<T>; limit?: number }) {}

  public createOne() {}

  public createMany() {}

  public updateOne() {}

  public updateMany() {}

  public deleteOne(id: string) {
    const query = `DELETE FROM ${this.tableName} WHERE id=$1;`;
    QueryHandler.handleClientQuery(query, [id]);
  }

  public deleteMany() {}

  public deleteAll() {}

  public async buildTable() {
    try {
      const query = await QueryHandler.buildTableQuery(this.tableName, this.attributes);
      await QueryHandler.handleClientQuery(query);
    } catch (error) {
      console.error(error);
    }
  }

  static getAllInstances() {
    return tableModels;
  }

  static async buildAllTables() {
    const tablePromises = tableModels.map((table) => () => table.buildTable());
    let success = true;

    try {
      await Promise.all(tablePromises);
    } catch (error) {
      console.error(error);
      success = false;
    }
    return success;
  }
}
