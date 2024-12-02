// Symlinks 表对应的接口
export interface Symlink {
  id?: number; // id 是可选的，因为在插入时可能还不存在
  source: string;
  target: string;
  alias: string;
  description: string;
  created_at: number; // 使用 UNIX 时间戳表示日期和时间
  updated_at: number;
}

// RestCount 表对应的接口
export interface RestCount {
  id?: number; // id 是可选的
  duration: number;
  day: string; // 使用字符串格式 "YYYY-MM-DD"
  created_at: number;
  updated_at: number;
}

// LastInteraction 表对应的接口
export interface LastInteraction {
  id?: number; // id 是可选的
  timestamp: number; // 时间戳表示
  day: string;
  created_at: number;
  updated_at: number;
}
