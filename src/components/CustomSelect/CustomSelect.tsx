import React, { useState } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ETypeName, IData } from "../../types";

interface CustomSelectProps {
  data: IData[];
  multiple?: boolean;
  label: string;
  onAddOption: (option: string, type: ETypeName) => void;
  onDeleteOption: (optionId: string, type: ETypeName) => void;  
  type: ETypeName;
  value: IData[] | IData | null;
  onChange: (value: IData[] | IData | null) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  data,
  multiple = false,
  label,
  onAddOption, onDeleteOption,
  type,
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const filter = createFilterOptions<IData>();
  
  return (
    <Autocomplete
      multiple={multiple}
      options={data}
      value={value}
      onChange={(event, newValue) => {
        if (newValue === null) {
          if (multiple) {
            onChange([]);
          } else {
            onChange(null);
          }
        } else {
          onChange(newValue);
        }
      }}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          onChange={(event) => setInputValue(event.target.value)}
          key={params.id}
          {...params}
          label={label}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={`${option.id}-${option.name}`} style={{display: 'flex', justifyContent: 'space-between'}}>
          {option.id === "add" ? (
            <button type="button" onClick={(event) => {
              event.stopPropagation();
              onAddOption(inputValue, type);
            }}>
              {option.name}
            </button>
          ) : (
            option.name
          )}

          {option.id.includes('new') && <button onClick={() => onDeleteOption(option.id, type)}>del</button> }
        </li>
      )}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const isValuePresent = options.some(
          (option) =>
            option.name.toLowerCase() === params.inputValue.toLowerCase()
        );

        if (params.inputValue !== "" && !isValuePresent) {
          filtered.push({
            id: "add",
            name: `Добавить "${params.inputValue}"`,
          });
        }

        return filtered;
      }}
    />
  );
};

export default CustomSelect;
