import { E_TableNames } from ".";
import BaseModel from "../utils/baseModel";
import { DataTypes } from "../types";

export enum E_SkillCategory {
  FRONT_END = "front_end",
  BACK_END = "back_end",
}

export type T_Skills = {
  id: string;
  name: string;
  description: string;
  category: E_SkillCategory;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export default class SkillsModel extends BaseModel<T_Skills> {
  constructor() {
    super({
      tableName: E_TableNames.SKILLS,
      attributes: {
        id: {
          name: "id",
          type: DataTypes.UUID,
          primary_key: true,
          notNull: true,
        },
        name: {
          name: "name",
          type: DataTypes.VARCHAR,
          size: 255,
          notNull: true,
        },
        description: {
          name: "description",
          type: DataTypes.TEXT,
          notNull: false,
        },
        category: {
          name: "category",
          type: DataTypes.ENUM,
          values: [...Object.values(E_SkillCategory)],
          default: E_SkillCategory.FRONT_END,
          notNull: true,
        },
        image: {
          name: "image",
          type: DataTypes.VARCHAR,
          size: 255,
          notNull: false,
        },
        createdAt: {
          name: "created_at",
          type: DataTypes.TIMESTAMP,
          notNull: true,
          default: true,
        },
        updatedAt: {
          name: "updated_at",
          type: DataTypes.TIMESTAMP,
          notNull: true,
          default: true,
        },
      },
    });
  }
}
