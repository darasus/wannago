import {BubbleMenuProps} from '@tiptap/react';
import {FC, ReactNode} from 'react';
import {TextFormatMenuItem} from './features/TextFormatMenuIItem/TextFormatMenuItem';
import {LinkMenuItem} from './features/LinkMenuItem/LinkMenuItem';
import {TextStyleMenuItems} from './features/TextStyleMenuItems/TextStyleMenuItems';
import {ColorSelectorMenuItem} from './features/ColorSelectorMenuItem/ColorSelectorMenuItem';

export interface BubbleMenuItem {
  name: ReactNode;
  isActive: () => boolean;
  command: () => void;
  shortcut?: string;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'> & {
  right?: ReactNode;
};

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  if (!props.editor) {
    return null;
  }

  return (
    <div className="flex items-center p-2 gap-2">
      <TextFormatMenuItem editor={props.editor} />
      <LinkMenuItem editor={props.editor} />
      <TextStyleMenuItems editor={props.editor} />
      <ColorSelectorMenuItem editor={props.editor} />
    </div>
  );
};
