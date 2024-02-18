import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { Search } from "lucide-react";
import { useState } from "react";

export function AddTagDropdown({ button }: { button: React.ReactNode }) {
  const [search, setSearch] = useState("");

  return (
    <Dropdown
      showArrow
      radius="sm"
      classNames={{
        base: "before:bg-default-200", // change arrow background
        content: "p-0 border-small border-divider bg-background",
      }}
    >
      <DropdownTrigger>
        {button}
        {/* <Button variant="ghost" disableRipple>
          Open Menu
        </Button> */}
      </DropdownTrigger>
      <DropdownMenu
        aria-label="태그 추가"
        // disabledKeys={["profile"]}

        className="p-3"
        itemClasses={{
          base: [
            "rounded-md",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-100",
            "dark:data-[hover=true]:bg-default-50",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
      >
        <DropdownSection aria-label="Profile & Actions">
          <DropdownItem
            isReadOnly
            key="profile"
            className="gap-2 data-[hover=true]:bg-transparent p-0"

            // classNames={{
            //   wrapper: "p-0",
            // }}
          >
            <Input
              // label="태그 검색"
              labelPlacement="outside"
              isClearable
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              classNames={
                {
                  // label: "text-black/50 dark:text-white/90",
                  // input: [
                  //   "bg-transparent",
                  //   "text-black/90 dark:text-white/90",
                  //   "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                  // ],
                  // innerWrapper: "bg-transparent",
                  // inputWrapper: [
                  //   "shadow-xl",
                  //   "bg-default-200/50",
                  //   "dark:bg-default/60",
                  //   "backdrop-blur-xl",
                  //   "backdrop-saturate-200",
                  //   "hover:bg-default-200/70",
                  //   "dark:hover:bg-default/70",
                  //   "group-data-[focused=true]:bg-default-200/50",
                  //   "dark:group-data-[focused=true]:bg-default/60",
                  //   "!cursor-text",
                  // ],
                }
              }
              placeholder="태그 이름을 입력하세요..."
              startContent={
                <Search className="text-black/50 mb-0.5 dark:text-white/90 text-gray-400 pointer-events-none flex-shrink-0 w-4 h-4" />
              }
            />
          </DropdownItem>
        </DropdownSection>

        {/* <DropdownSection aria-label="Profile & Actions" showDivider>
          <DropdownItem
            isReadOnly
            key="profile"
            className="gap-2 opacity-100 h-14"
          >
            <User
              name="Junior Garcia"
              description="@jrgarciadev"
              classNames={{
                name: "text-default-600",
                description: "text-default-500",
              }}
              avatarProps={{
                size: "sm",
                src: "https://avatars.githubusercontent.com/u/30373425?v=4",
              }}
            />
          </DropdownItem>
          <DropdownItem key="dashboard">Dashboard</DropdownItem>
          <DropdownItem key="settings">Settings</DropdownItem>
          <DropdownItem key="new_project" endContent={""}>
            New Project
          </DropdownItem>
        </DropdownSection> */}

        <DropdownSection aria-label="Preferences" showDivider>
          <DropdownItem key="quick_search" shortcut="⌘K">
            Quick search
          </DropdownItem>
          <DropdownItem
            isReadOnly
            key="theme"
            className="cursor-default"
            endContent={
              <select
                className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                id="theme"
                name="theme"
              >
                <option>System</option>
                <option>Dark</option>
                <option>Light</option>
              </select>
            }
          >
            Theme
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout">Log Out</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
