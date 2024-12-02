import { LastInteraction, RestCount, Symlink } from "@/types/dbt";
import { getDBInstance } from "./init";

// Symlinks 表操作
export const insertSymlink = async (symlink: Omit<Symlink, "id">) => {
  const db = await getDBInstance();
  const timestamp = Date.now();
  await db.execute(
    `INSERT INTO Symlinks (source, target, alias, description, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      symlink.source,
      symlink.target,
      symlink.alias,
      symlink.description,
      timestamp,
      timestamp,
    ],
  );
};

export const updateSymlink = async (id: number, symlink: Partial<Symlink>) => {
  const db = await getDBInstance();
  const timestamp = Date.now();
  await db.execute(
    `UPDATE Symlinks 
     SET source = ?, target = ?, alias = ?, description = ?, updated_at = ? 
     WHERE id = ?`,
    [
      symlink.source,
      symlink.target,
      symlink.alias,
      symlink.description,
      timestamp,
      id,
    ],
  );
};

export const getSymlinks = async (): Promise<Symlink[]> => {
  const db = await getDBInstance();
  return await db.select("SELECT * FROM Symlinks");
};

// RestCount 表操作
export const insertOrUpdateRestCount = async (
  restCount: Omit<RestCount, "id">,
) => {
  const db = await getDBInstance();
  const timestamp = Date.now();
  await db.execute(
    `INSERT INTO RestRecord (duration,day, created_at, updated_at)
     VALUES (?, ?, ?, ?)`,
    [restCount.duration, restCount.day, timestamp, timestamp],
  );
};

export const getTodayRestCounts = async (
  day: string,
): Promise<number | null> => {
  const db = await getDBInstance();
  const result = await db.select<{ count: number }>(
    "SELECT count(*) as count FROM RestRecord where day = ?",
    [day],
  );

  console.log("result", result);
  return result ? result.count : null;
};

export const getRestCounts = async (): Promise<RestCount[]> => {
  const db = await getDBInstance();
  return await db.select("SELECT * FROM RestCount");
};

// LastInteraction 表操作
export const insertOrUpdateLastInteraction = async (
  interaction: Omit<LastInteraction, "id">,
) => {
  const db = await getDBInstance();
  const timestamp = Date.now();
  await db.execute(
    `INSERT INTO LastInteraction (timestamp, day, created_at, updated_at)
     VALUES (?, ?, ?, ?)`,

    [interaction.timestamp, interaction.day, timestamp, timestamp],
  );
};

export const getLastInteraction = async (): Promise<LastInteraction | null> => {
  const db = await getDBInstance();
  const results: LastInteraction[] = await db.select(
    "SELECT * FROM LastInteraction ORDER BY id DESC LIMIT 1",
  );
  return results.length ? results[0] : null;
};

export const getTodayLastInteraction = async (
  day: string,
): Promise<LastInteraction | null> => {
  const db = await getDBInstance();
  const results: LastInteraction[] = await db.select(
    "SELECT * FROM LastInteraction where day = ? ORDER BY id DESC LIMIT 1",
    [day],
  );
  return results.length ? results[0] : null;
};
