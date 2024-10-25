import { E_TableNames } from ".";
import BaseModel from "../utils/baseModel";

type T_Articles = {};

export default class Articles extends BaseModel<T_Articles> {
  constructor() {
    super({ tableName: E_TableNames.ARTICLES, attributes: {} });
  }
}
