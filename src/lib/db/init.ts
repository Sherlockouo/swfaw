import Database from "@tauri-apps/plugin-sql";

let dbInstance: Database | null = null;

export const getDBInstance = async (): Promise<Database> => {
  if (!dbInstance) {
    dbInstance = await Database.load("sqlite:mydatabase.db");

    // 创建 Symlinks 表
    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS Symlinks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        target TEXT NOT NULL,
        alias TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    // 为 Symlinks 表添加索引
    await dbInstance.execute(`
      CREATE INDEX IF NOT EXISTS idx_symlinks_alias ON Symlinks (alias);
    `);
    await dbInstance.execute(`
      CREATE INDEX IF NOT EXISTS idx_symlinks_description ON Symlinks (description);
    `);

    // 创建 RestCount 表
    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS RestRecord(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        duration INTEGER NOT NULL,
        day TEXT NOT NULL ,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    // 为 RestCount 表添加索引
    await dbInstance.execute(`
      CREATE INDEX IF NOT EXISTS idx_restcount_day ON RestRecord (day);
    `);

    // 创建 LastInteraction 表
    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS LastInteraction (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL, 
        day TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    // 为 LastInteraction 表添加索引
    await dbInstance.execute(`
      CREATE INDEX IF NOT EXISTS idx_lastinteraction_day ON LastInteraction(day);
    `);
  }
  return dbInstance;
};
