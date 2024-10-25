import { E_TableNames } from "./tables";

export enum E_WhereOperators {
  EQUALS = "=",
  BIGGER = ">",
  SMALLER = "<",
  IS = "IS NULL",
  NOT_NULL = "IS NOT NULL",
  NOT = "NOT",
  BETWEEN = "BETWEEN",
  IN = "IN",
  LIKE = "LIKE",
}

type T_ComparisonCondition = {
  op: E_WhereOperators.EQUALS | E_WhereOperators.BIGGER | E_WhereOperators.SMALLER;
  value: number;
};

type T_LikeCondition = {
  op: E_WhereOperators.LIKE;
  value: string;
};

type T_NullCondition = {
  op: E_WhereOperators.IS | E_WhereOperators.NOT_NULL;
  value: string;
};

type T_BetweenCondition = {
  op: E_WhereOperators.BETWEEN;
  value: [number, number];
};

type T_InCondition = {
  op: E_WhereOperators.IN;
  value: string[];
};

type T_NotCondition = {
  op: E_WhereOperators.NOT;
  value: T_ComparisonCondition | T_LikeCondition | T_BetweenCondition | T_InCondition;
};

type T_Condition =
  | T_ComparisonCondition
  | T_LikeCondition
  | T_NullCondition
  | T_BetweenCondition
  | T_InCondition
  | T_NotCondition;

export type T_WhereClause<T> = Record<keyof T, T_Condition>;

export enum DataTypes {
  UUID = "UUID",
  INT = "INT",
  BOOL = "BOOLEAN",
  DATE = "DATE",
  TIMESTAMP = "TIMESTAMP",
  ENUM = "ENUM",
  VARCHAR = "VARCHAR",
  TEXT = "TEXT",
  JSON = "JSON",
  ONE_TO_ONE = "ONE_TO_ONE",
  ONE_TO_MANY = "ONE_TO_MANY",
  MANY_TO_MANY = "MANY_TO_MANY",
}

type T_BoolAttribute = {
  type: DataTypes.BOOL;
  default?: boolean;
};

type T_IntAttribute = {
  type: DataTypes.INT;
  default?: number;
};

type T_UuidAttribute = {
  type: DataTypes.UUID;
  primary_key: boolean;
};

type T_TimestampAttribute = {
  type: DataTypes.TIMESTAMP;
  default?: boolean;
};

type T_EnumAttribute = {
  type: DataTypes.ENUM;
  values: string[];
  default?: string;
};

type T_VarcharAttribute = {
  type: DataTypes.VARCHAR;
  size: number;
  unique?: boolean;
};

type T_TextAttribute = {
  type: DataTypes.TEXT;
};

type T_JsonAttribute = {
  type: DataTypes.JSON;
};

export type T_OneToOneAttribute = {
  type: DataTypes.ONE_TO_ONE;
  table: E_TableNames;
  id: string;
};

export type T_OneToManyAttribute = {
  type: DataTypes.ONE_TO_MANY;
  table: E_TableNames;
  id: string;
};

export type T_ManyToManyAttribute = {
  type: DataTypes.MANY_TO_MANY;
  table1: E_TableNames;
  table2: E_TableNames;
  id1: string;
  id2: string;
};

type T_AttributeBase =
  | T_BoolAttribute
  | T_IntAttribute
  | T_UuidAttribute
  | T_TimestampAttribute
  | T_EnumAttribute
  | T_VarcharAttribute
  | T_TextAttribute
  | T_JsonAttribute
  | T_OneToOneAttribute
  | T_OneToManyAttribute
  | T_ManyToManyAttribute;

export type T_Attribute = {
  name: string;
  notNull?: boolean;
} & T_AttributeBase;

export type T_Attributes<T> = Record<keyof T, T_Attribute>;
