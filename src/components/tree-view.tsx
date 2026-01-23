import * as React from "react"
import { ChevronRight, File, Folder } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export type TreeItem = string | [string, ...TreeItem[]]

interface TreeViewProps {
    data: TreeItem[]
    value?: string | null
    onSelect?: (value: string) => void
}

interface TreeProps {
    item: TreeItem
    selectedValue?: string | null
    onSelect?: (value: string) => void
    parentPath: string
}

const Tree = ({ item, selectedValue, onSelect, parentPath }: TreeProps) => {
    const [name, ...items] = Array.isArray(item) ? item : [item]
    const currentPath = parentPath ? `${parentPath}/${name}` : name
    const isSelected = selectedValue === currentPath

    if (!items.length) {
        // It's a file
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    isActive={isSelected}
                    onClick={() => onSelect?.(currentPath)}
                    className="data-[active=true]:bg-transparent"
                >
                    <File className="size-4" />
                    {name}
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    // It's a folder
    return (
        <SidebarMenuItem>
            <SidebarMenuButton className="data-[active=true]:bg-transparent">
                <Folder className="size-4" />
                {name}
            </SidebarMenuButton>
            <SidebarMenuSub>
                {items.map((subItem, index) => (
                    <Tree
                        key={index}
                        item={subItem}
                        selectedValue={selectedValue}
                        onSelect={onSelect}
                        parentPath={currentPath}
                    />
                ))}
            </SidebarMenuSub>
        </SidebarMenuItem>
    )
}

export const TreeView = ({
    data,
    value,
    onSelect,
}: TreeViewProps) => {
    return (
        <SidebarProvider>
            <Sidebar collapsible="none" className="w-full">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {data.map((item, index) => (
                                    <Tree
                                        key={index}
                                        item={item}
                                        selectedValue={value}
                                        onSelect={onSelect}
                                        parentPath=""
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
        </SidebarProvider>
    )
}
