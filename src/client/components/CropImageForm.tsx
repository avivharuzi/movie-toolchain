import { useForm } from 'react-hook-form';

export interface CropImageFormValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CropImageFormProps {
  values?: CropImageFormValues;
  onSubmit?: (values: CropImageFormValues) => void;
}

const getCropImageFormDefaultValues = (): CropImageFormValues => {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
};

const CropImageForm = ({ values, onSubmit }: CropImageFormProps) => {
  const { register, handleSubmit } = useForm<CropImageFormValues>({
    values: values || getCropImageFormDefaultValues(),
  });

  const getInput = (name: keyof CropImageFormValues, placeholder: string) => {
    return (
      <>
        <label className="form-label">{placeholder}</label>
        <input
          type="number"
          className="form-control"
          placeholder={placeholder}
          defaultValue={0}
          {...register(name, { required: true, min: 0, valueAsNumber: true })}
        />
      </>
    );
  };

  return (
    <form
      className="d-flex flex-column gap-2 align-items-center justify-content-center"
      onSubmit={handleSubmit((values) => (onSubmit ? onSubmit(values) : {}))}
    >
      <div className="d-flex align-items-center gap-4">
        <div>{getInput('left', 'Left')}</div>
        <div className="d-flex flex-column gap-4">
          <div>{getInput('top', 'Top')}</div>
          <div>{getInput('bottom', 'Bottom')}</div>
        </div>
        <div>{getInput('right', 'Right')}</div>
      </div>

      <div>
        <input className="btn btn-success" type="submit" value="Apply" />
      </div>
    </form>
  );
};

export default CropImageForm;
