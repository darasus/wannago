import {Editor} from '@tiptap/core';
import {Check, Link, Trash} from 'lucide-react';
import {Button, Input, Popover, PopoverContent, PopoverTrigger} from 'ui';
import {MenuItemButton} from '../../components/MenuItemButton/MenuItemButton';

interface Props {
  editor: Editor;
}

export function LinkMenuItem({editor}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <MenuItemButton isActive={editor.isActive('link')}>
          <Link className="w-4 h-4" />
        </MenuItemButton>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <form
          onSubmit={(e) => {
            const input = (e.target as any)[0] as HTMLInputElement;
            editor?.chain().focus().setLink({href: input.value}).run();
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Paste a link"
              defaultValue={editor.getAttributes('link').href || ''}
            />
            {editor.getAttributes('link').href ? (
              <Button
                onClick={(e) => {
                  editor?.chain().focus().unsetLink().run();
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
      </PopoverContent>
    </Popover>
  );
}
