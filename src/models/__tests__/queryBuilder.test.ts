// __tests__/tableBuilder.test.ts

import QueryHandler from "../utils/queryBuilder";
import { DataTypes, T_Attributes } from "../types";

describe("queryBuilder.buildTable", () => {
  beforeAll(() => {
    jest.spyOn(QueryHandler, "createEnumType").mockImplementation(async () => {
      return Promise.resolve();
    });
  });
  it("should generate a CREATE TABLE SQL query without defaults or constraints", async () => {
    const attributes: T_Attributes<any> = {
      name: { name: "name", type: DataTypes.VARCHAR, size: 100 },
      age: { name: "age", type: DataTypes.INT },
      createdAt: { name: "created_at", type: DataTypes.TIMESTAMP },
      description: { name: "description", type: DataTypes.TEXT },
      data: { name: "data", type: DataTypes.JSON },
    };

    const query = await QueryHandler.buildTableQuery("profiles", attributes);

    const expectedQuery =
      `CREATE TABLE IF NOT EXISTS profiles (name VARCHAR(100), age INT, created_at TIMESTAMP, description TEXT, data JSON);`
        .trim()
        .replace(/\s+/g, " ");

    expect(query.replace(/\s+/g, " ")).toBe(expectedQuery);
  });

  it("should generate a CREATE TABLE SQL query with various attributes", async () => {
    const attributes: T_Attributes<any> = {
      id: { name: "id", type: DataTypes.UUID, primary_key: true },
      age: { name: "age", type: DataTypes.INT, default: 25, notNull: true },
      isActive: { name: "is_active", type: DataTypes.BOOL, default: true, notNull: true },
      username: { name: "username", type: DataTypes.VARCHAR, size: 255, unique: true, notNull: true },
      bio: { name: "bio", type: DataTypes.TEXT },
      metadata: { name: "metadata", type: DataTypes.JSON },
      createdAt: { name: "created_at", type: DataTypes.TIMESTAMP, default: true, notNull: true },
    };

    const query = await QueryHandler.buildTableQuery("users", attributes);

    const expectedQuery =
      `CREATE TABLE IF NOT EXISTS users (id uuid PRIMARY KEY, age INT DEFAULT 25 NOT NULL, is_active BOOLEAN DEFAULT true NOT NULL, username VARCHAR(255) UNIQUE NOT NULL, bio TEXT, metadata JSON, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);`
        .trim()
        .replace(/\s+/g, " ");

    expect(query.replace(/\s+/g, " ")).toBe(expectedQuery);
  });
});
