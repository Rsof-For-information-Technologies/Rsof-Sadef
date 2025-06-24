import { Toggle } from "@radix-ui/react-toggle";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Type,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Editor } from "@tiptap/react";

interface MenubarProps {
  editor: Editor | null;
}

export default function Menubar({ editor }: MenubarProps) {
  if (!editor) {
    return null;
  }

  const headingOptions = [
    {
      icon: <Heading1 className="size-4" />,
      label: "Heading 1",
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      label: "Heading 2",
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      label: "Heading 3",
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
    },
  ];

  const fontSizeOptions = [
    {
      label: "Small",
      size: "12px",
      onClick: () => editor.chain().focus().setFontSize("12px").run(),
    },
    {
      label: "Normal",
      size: "16px",
      onClick: () => editor.chain().focus().setFontSize("16px").run(),
    },
    {
      label: "Large",
      size: "20px",
      onClick: () => editor.chain().focus().setFontSize("20px").run(),
    },
    {
      label: "Extra Large",
      size: "24px",
      onClick: () => editor.chain().focus().setFontSize("24px").run(),
    },
  ];

  const textAlignOptions = [
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
      title: "Align Left",
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
      title: "Align Center",
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
      title: "Align Right",
    },
  ];

  const activeHeading = headingOptions.find((option) => option.active);
  const currentFontSize = editor.getAttributes("textStyle")?.fontSize || "16px";

  const otherOptions = [
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
      title: "Bold",
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
      title: "Italic",
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
      title: "Strikethrough",
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
      title: "Bullet List",
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
      title: "Ordered List",
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      pressed: editor.isActive("codeBlock"),
      title: "Code Block",
    },
    {
      icon: <Link className="size-4" />,
      onClick: () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) {
          return;
        }

        // empty
        if (url === "") {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }

        // update link
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      },
      pressed: editor.isActive("link"),
      title: "Link",
    },
    {
      icon: <Undo className="size-4" />,
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
      title: "Undo",
    },
    {
      icon: <Redo className="size-4" />,
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
      title: "Redo",
    },
  ];

  return (
    <div className="flex flex-wrap bg-gray-100 items-center gap-1 border-2 rounded-md px-2 py-2">
      {/* Heading Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-1 p-2 rounded hover:bg-slate-200 transition-colors">
            {activeHeading?.icon || <Type className="size-4" />}
            <span className="text-sm">{activeHeading?.label || "Text"}</span>
            <ChevronDown className="size-3" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="min-w-[220px] bg-white rounded-md shadow-lg z-50 ml-6">
            <DropdownMenu.Label className="px-3 py-2 text-xs font-medium text-slate-500">
              Headings
            </DropdownMenu.Label>
            {headingOptions.map((option, index) => (
              <DropdownMenu.Item
                key={`heading-${index}`}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${
                  option.active ? "bg-slate-100" : "hover:bg-slate-50"
                }`}
                onClick={option.onClick}
              >
                {option.icon}
                <span>{option.label}</span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Font Size Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-1 p-2 rounded hover:bg-slate-200 transition-colors">
            <Type className="size-4" />
            <span className="text-sm">{currentFontSize}</span>
            <ChevronDown className="size-3" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="min-w-[220px] bg-white rounded-md shadow-lg z-50">
            <DropdownMenu.Label className="px-3 py-2 text-xs font-medium text-slate-500">
              Font Size
            </DropdownMenu.Label>
            {fontSizeOptions.map((option, index) => (
              <DropdownMenu.Item
                key={`size-${index}`}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer ${
                  currentFontSize === option.size
                    ? "bg-slate-100"
                    : "hover:bg-slate-50"
                }`}
                onClick={option.onClick}
              >
                <span>{option.label}</span>
                <span className="text-slate-500">{option.size}</span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Text Alignment Options */}
      {textAlignOptions.map((option, index) => (
        <Toggle
          key={`align-${index}`}
          pressed={option.pressed || false}
          onPressedChange={option.onClick}
          className="p-2 rounded hover:bg-slate-200 transition-colors"
          aria-label={option.title}
          title={option.title}
        >
          {option.icon}
        </Toggle>
      ))}

      {/* Other Formatting Options */}
      {otherOptions.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.pressed || false}
          onPressedChange={option.onClick}
          disabled={option.disabled || false}
          className="p-2 rounded hover:bg-slate-200 transition-colors"
          aria-label={option.title}
          title={option.title}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
