import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, TextareaAutosize } from '@mui/material';
import CustomSelect from '../CustomSelect/CustomSelect';
import './myform.css';
import useGetData from '../../gqlQueries/hooks/useGetData';
import { ETypeName, IData } from '../../types';
import { v4 } from 'uuid';

interface FormData {
  textInput: string;
  textArea: string;
  relations: IData[];
  positions: IData;
}

const MyForm: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { relations, positions, loading, error } = useGetData();
  const [relationsOptions, setRelationsOptions] = useState<IData[]>([]);
  const [positionsOptions, setPositionsOptions] = useState<IData[]>([]);


  useEffect(() => {
    if (relations) {
      setRelationsOptions(relations);
    }
    if (positions) {
      setPositionsOptions(positions);
    }
  }, [relations, positions]);
  
  const onAddOption = (option: string, type: ETypeName) => {
    const newOption = { type, id: `${v4()}-new`, name: option };
    if (type === ETypeName.relation) {
        setRelationsOptions(state => [...state, newOption]);
    } else {
        setPositionsOptions(state => [...state, newOption]);
    }
  };

  const onDeleteOption = (optionId: string, type: ETypeName) => {
    if (type === ETypeName.relation) {
      setRelationsOptions(state => state.filter(option => option.id !== optionId));
  } else {
      setPositionsOptions(state => state.filter(option => option.id !== optionId));
  }
  }


  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  
  return (
    <div className="form-container">
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="textInput"
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field }) => <TextField {...field} error={!!errors.textInput} helperText={errors.textInput?.message} />}
      />
      <Controller
        name="textArea"
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field }) => <TextareaAutosize {...field} />}
      />
      <Controller
        name="relations"
        control={control}
        render={({ field }) => (
          <CustomSelect {...field} data={relationsOptions} onAddOption={onAddOption} onDeleteOption={onDeleteOption} type={ETypeName.relation} label='Relations' multiple />
        )}
      />
      <Controller
        name="positions"
        control={control}
        render={({ field }) => (
          <CustomSelect {...field} data={positionsOptions} onAddOption={onAddOption} onDeleteOption={onDeleteOption} type={ETypeName.position} label='Positions' />
        )}
      />
      <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default MyForm;