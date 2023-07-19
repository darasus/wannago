import {Editor} from './editor/Editor';

interface Props {
  dataTestId?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function RichTextarea({dataTestId, value, onChange}: Props) {
  return <Editor dataTestId={dataTestId} value={value} onChange={onChange} />;
}
