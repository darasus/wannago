interface Props {
  title: string;
  description: string;
  id?: string;
}

export function SecionHeader({title, description, id}: Props) {
  return (
    <div className="mx-auto text-center mb-16 max-w-xl">
      <h2
        id={id}
        className="font-bold text-3xl tracking-tight text-brand-200 sm:text-4xl"
      >
        {title}
      </h2>
      <p className="mt-4 text-xl tracking-tight text-slate-800">
        {description}
      </p>
    </div>
  );
}
