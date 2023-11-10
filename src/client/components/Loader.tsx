export interface LoaderProps {
  isLoading: boolean;
}

export const Loader = ({ isLoading }: LoaderProps) => {
  if (!isLoading) {
    return;
  }

  return (
    <div className="loader d-flex justify-content-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
