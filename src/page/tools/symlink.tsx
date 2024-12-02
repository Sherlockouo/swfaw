import React, { useEffect, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import * as fs from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";
import { join } from "@tauri-apps/api/path";
import { useConfig } from "@/hooks/useConfig"; // 假设 useConfig 是一个自定义 Hook
import { Button, Input, Switch } from "@nextui-org/react";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

interface SymLink {
  source: string;
  target: string;
}

const SoftLinkCreator = () => {
  const [sourcePath, setSourcePath] = useState("");
  const [targetPath, setTargetPath] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [targetFile, setTargetFile] = useState("");
  const [links, setLinks] = useConfig<SymLink[]>("symlinks", [], {
    sync: true,
  }); // 使用 useConfig 存储软链接信息

  // 选择源文件或文件夹
  const handleSelectSource = async () => {
    const result = await open({
      multiple: false,
      directory: isSelected,
    });

    if (result) {
      setSourcePath(result as string);
    }
  };

  // 选择目标文件夹
  const handleSelectTarget = async () => {
    const result = await open({
      directory: true,
    });

    if (result) {
      setTargetPath(result as string);
    }
  };

  // 创建软链接
  const handleCreateLink = async () => {
    if (!sourcePath || !targetPath) {
      toast.error("请选择源和目标路径");
      return;
    }

    try {
      if (isSelected) {
        const entries = await fs.readDir(sourcePath);
        await processEntriesRecursively(sourcePath, targetPath, entries);
        toast.success(`成功创建软链接`);
      } else {
        let symTarget = await join(targetPath, targetFile);
        toast.info(`创建软链接: ${sourcePath} -> ${symTarget}`);
        await createSymlink(sourcePath, symTarget);
        toast.success(`成功创建软链接`);
      }
    } catch (error) {
      toast.error(`创建软链接失败: ${error}`);
    }
  };

  // 递归处理目录中的条目
  const processEntriesRecursively = async (
    sourceDir: string,
    targetDir: string,
    entries: any[],
  ) => {
    for (const entry of entries) {
      const itemSourcePath = await join(sourceDir, entry.name);
      const itemTargetPath = await join(targetDir, entry.name);

      if (entry.children) {
        // entry is a directory
        await fs.mkdir(itemTargetPath, { recursive: true });
        const subEntries = await fs.readDir(itemSourcePath);
        await processEntriesRecursively(
          itemSourcePath,
          itemTargetPath,
          subEntries,
        );
      } else {
        try {
          // entry is a file
          await createSymlink(itemSourcePath, itemTargetPath);
        } catch (error) {
          toast.error(`recursive 创建软链接失败: ${error}`);
        }
      }
    }
  };
  // 创建单个文件的软链接
  const createSymlink = async (source: string, target: string) => {
    try {
      await invoke("create_symlink", { source, target });
      setLinks((prevLinks: SymLink[]) => [...prevLinks, { source, target }]);
    } catch (error) {
      toast.error(`创建软链接失败: ${error}`);
    }
  };

  useEffect(() => {
    console.log("links", links);
  }, [links]);

  return (
    <div className="flex flex-col">
      <h2>软链接创建器</h2>
      <div className="flex flex-col">
        <Switch checked={isSelected} onValueChange={setIsSelected}>
          Symbolic Link Dir
        </Switch>
        <div className="flex gap-2 m-2 justify-around items-center">
          <div>
            <Button
              aria-label="choose source file or directory"
              onClick={handleSelectSource}
            >
              选择文件或文件夹
            </Button>
            <span>{sourcePath}</span>
          </div>
          <div>
            <Button
              aria-label="choose target file or directory"
              onClick={handleSelectTarget}
            >
              选择目标目录
            </Button>
            <span>{targetPath}</span>

            {!isSelected && (
              <Input
                size={"md"}
                type="text"
                label="FileName"
                placeholder="Enter target file name"
                onValueChange={(e) => {
                  setTargetFile(e);
                }}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Button aria-label="create symlink" onClick={handleCreateLink}>
            创建软链接
          </Button>
        </div>
      </div>
      <h3>已创建的软链接</h3>
      <div>
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>Source</TableColumn>
            <TableColumn>Target</TableColumn>
            <TableColumn>Operation</TableColumn>
          </TableHeader>
          <TableBody>
            {links &&
              links.map((link: SymLink, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{link.source}</TableCell>
                    <TableCell>{link.target}</TableCell>
                    <TableCell>Active</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SoftLinkCreator;
