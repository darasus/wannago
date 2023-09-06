import {BubbleMenuProps} from '@tiptap/react';
import {FC, ReactNode} from 'react';
import {
  Bold,
  Check,
  Italic,
  Link,
  Strikethrough,
  Trash,
  Underline,
} from 'lucide-react';
import {Editor} from '@tiptap/core';
import {ColorSelector} from './ColorSelector';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  Input,
  Button,
} from 'ui';
import {cn} from '../../../../utils';

export interface BubbleMenuItem {
  name: ReactNode;
  isActive: () => boolean;
  command: () => void;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'> & {
  right?: ReactNode;
};

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  if (!props.editor) {
    return null;
  }

  const {mainMenuItems} = createMainItems({
    editor: props.editor,
  });
  const {nodeSelectorItemActive, nodeSelectorItems} = createNodeSelectorItems({
    editor: props.editor,
  });

  return (
    <Menubar className="rounded-none border-t-0 border-l-0 border-r-0">
      <MenubarMenu>
        <MenubarTrigger>
          <span className="whitespace-nowrap">
            {nodeSelectorItemActive?.name}
          </span>
        </MenubarTrigger>
        <MenubarContent>
          {nodeSelectorItems.map((item, index) => (
            <MenubarItem
              key={index}
              onClick={(e) => {
                item.command();
                e.preventDefault();
              }}
            >
              <div className="flex items-center space-x-2">
                <span>{item.name}</span>
              </div>
              {nodeSelectorItemActive.name === item.name && (
                <Check className="h-4 w-4 ml-2 text-green-500" />
              )}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger
          className={cn('px-1', {'bg-muted': props.editor.isActive('link')})}
        >
          <Link className="w-4 h-4" />
        </MenubarTrigger>
        <MenubarContent className="p-2">
          <form
            onSubmit={(e) => {
              const input = (e.target as any)[0] as HTMLInputElement;
              props.editor?.chain().focus().setLink({href: input.value}).run();
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Paste a link"
                defaultValue={props.editor.getAttributes('link').href || ''}
              />
              {props.editor.getAttributes('link').href ? (
                <Button
                  onClick={(e) => {
                    props.editor?.chain().focus().unsetLink().run();
                    e.preventDefault();
                  }}
                  size={'icon'}
                  variant={'destructive'}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              ) : (
                <Button size={'icon'} variant={'outline'}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </MenubarContent>
      </MenubarMenu>
      {mainMenuItems.map((item, index) => (
        <MenubarMenu key={index}>
          <MenubarTrigger
            className={cn('px-1', {
              'bg-muted': item.isActive(),
            })}
            key={index}
            onClick={(e) => {
              item.command();
            }}
          >
            {item.name}
          </MenubarTrigger>
        </MenubarMenu>
      ))}
      <ColorSelector editor={props.editor} />
      <div className="grow" />
      {props.right}
    </Menubar>
  );
};

function createNodeSelectorItems({editor}: {editor: Editor}) {
  const nodeSelectorItems: BubbleMenuItem[] = [
    {
      name: 'Text',
      command: () =>
        editor.chain().focus().toggleNode('paragraph', 'paragraph').run(),
      // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
      isActive: () =>
        editor.isActive('paragraph') &&
        !editor.isActive('bulletList') &&
        !editor.isActive('orderedList'),
    },
    {
      name: 'Heading 1',
      command: () => editor.chain().focus().toggleHeading({level: 1}).run(),
      isActive: () => editor.isActive('heading', {level: 1}),
    },
    {
      name: 'Heading 2',
      command: () => editor.chain().focus().toggleHeading({level: 2}).run(),
      isActive: () => editor.isActive('heading', {level: 2}),
    },
    {
      name: 'Heading 3',
      command: () => editor.chain().focus().toggleHeading({level: 3}).run(),
      isActive: () => editor.isActive('heading', {level: 3}),
    },
    // {
    //   name: 'To-do List',
    //   text: CheckSquare,
    //   command: () => editor.chain().focus().toggleTaskList().run(),
    //   isActive: () => editor.isActive('taskItem'),
    // },
    {
      name: 'Bullet list',
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      name: 'Numbered list',
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      name: 'Quote',
      command: () =>
        editor
          .chain()
          .focus()
          .toggleNode('paragraph', 'paragraph')
          .toggleBlockquote()
          .run(),
      isActive: () => editor.isActive('blockquote'),
    },
    // {
    //   name: 'Code',
    //   icon: Code,
    //   command: () => editor.chain().focus().toggleCodeBlock().run(),
    //   isActive: () => editor.isActive('codeBlock'),
    // },
  ];

  const nodeSelectorItemActive = nodeSelectorItems
    .filter((item) => item.isActive())
    .pop() ?? {
    name: 'Multiple',
  };

  return {nodeSelectorItems, nodeSelectorItemActive};
}

function createMainItems({editor}: {editor: Editor}) {
  const mainMenuItems: BubbleMenuItem[] = [
    {
      name: <Bold className="w-4 h-4" />,
      isActive: () => editor.isActive('bold'),
      command: () => editor.chain().focus().toggleBold().run(),
    },
    {
      name: <Italic className="w-4 h-4" />,
      isActive: () => editor.isActive('italic'),
      command: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      name: <Underline className="w-4 h-4" />,
      isActive: () => editor.isActive('underline'),
      command: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      name: <Strikethrough className="w-4 h-4" />,
      isActive: () => editor.isActive('strike'),
      command: () => editor.chain().focus().toggleStrike().run(),
    },
    // {
    //   name: 'code',
    //   isActive: () => editor.isActive('code'),
    //   command: () => editor.chain().focus().toggleCode().run(),
    //   icon: Code,
    // },
  ];

  return {
    mainMenuItems,
  };
}
