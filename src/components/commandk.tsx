import React, { useEffect, useState } from "react";
import { Command } from "cmdk";

interface CommandMenuProps {
    className?: string; // 允许用户传入额外的样式类名
}

const CMDK: React.FC<CommandMenuProps> = ({ className = "" }) => {
    const [open, setOpen] = useState(false);

    // Toggle the menu when ⌘K or Ctrl+K is pressed
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className={`fixed inset-0 z-50 flex items-center  justify-center p-4 bg-black/50 ${className}`}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full">
                <Command.Input
                    placeholder="Type a command..."
                    className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-700 focus:outline-none rounded-lg"
                />
                <Command.List className="rounded-lg">
                    <Command.Empty className="p-4 text-gray-500 dark:text-gray-400">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Letters" className="px-4 py-2">
                        <Command.Item className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            a
                        </Command.Item>
                        <Command.Item className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            b
                        </Command.Item>
                        <Command.Separator className="my-2 border-t border-gray-200 dark:border-gray-700" />
                        <Command.Item className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            c
                        </Command.Item>
                    </Command.Group>

                    <Command.Item className="px-4 py-2 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700">
                        Apple
                    </Command.Item>
                </Command.List>
            </div>
        </Command.Dialog>
    );
};

export default CMDK;