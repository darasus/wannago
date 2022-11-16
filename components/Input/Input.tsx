import clsx from 'clsx';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input(props: Props) {
  return (
    <div>
      {props.label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700"
        >
          {props.label}
        </label>
      )}
      <div className={clsx({'mt-1': props.id})}>
        <input
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...props}
        />
      </div>
    </div>
  );
}
