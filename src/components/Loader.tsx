interface LoaderProps {
  text?: string;
  fullscreen?: boolean;
}

export function Loader({ text = 'Se încarcă datele...', fullscreen = false }: LoaderProps) {
  return (
    <div className={fullscreen ? 'loader-container loader-fullscreen' : 'loader-container'}>
      <span className='loader-spinner' />
      <p>{text}</p>
    </div>
  );
}
