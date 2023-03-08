import React, { useState } from "react";
import { TextField, Paper, MenuItem, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

interface Suggestion {
  value: string;
  label: string;
}

interface InputWithSuggestionsProps {
  label: string;
  suggestions: Suggestion[];
  onSelect: (value: string) => void;
  onInputChange: (value: string) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "700px",
    color: "white",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
    "& .MuiAutocomplete-inputRoot": {
      backgroundColor: "white",
    },
    "& .MuiAutocomplete-paper": {
      backgroundColor: "white",
      color: "black",
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
  },
  textField: {
    color: "white",
    "& .MuiIconButton-label": {
      color: "white",
    },
  },
  paper: {
    backgroundColor: "white",
    color: "black",
    maxHeight: 200,
    overflow: "auto",
    padding: 0,
    "&:hover fieldset": {
      backgroundColor: "purple",
    },
    margin: 0,
  },
  option: {
    "&:hover": {
      backgroundColor: "#86888a !important",
    },
  },
  popper: {
    padding: "0",
    margin: "0",
  },
  listbox: {
    padding: 0,
  },
}));

const InputWithSuggestions: React.FC<InputWithSuggestionsProps> = ({
  label,
  suggestions,
  onSelect,
  onInputChange,
}) => {
  const [value, setValue] = useState("");
  const classes = useStyles();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onInputChange(event.target.value);
  };

  const handleSelect = (
    event: React.ChangeEvent<unknown>,
    suggestion: Suggestion | null
  ) => {
    if (suggestion) {
      setValue(suggestion.value);
      onSelect(suggestion.value);
    }
  };

  return (
    <div className={classes.root}>
      <Autocomplete
        options={suggestions}
        getOptionLabel={(option) => option.label}
        classes={{
          option: classes.option,
          popper: classes.popper,
          listbox: classes.listbox,
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            value={value}
            onChange={handleInputChange}
            variant="outlined"
            className={classes.textField}
            InputProps={{
              ...params.InputProps,
              style: { color: "white", backgroundColor: "inherit" },
            }}
          />
        )}
        renderOption={(option) => <MenuItem>{option.label}</MenuItem>}
        onChange={handleSelect}
        fullWidth
        PaperComponent={({ children }) => (
          <Paper className={classes.paper}>{children}</Paper>
        )}
      />
    </div>
  );
};

export default InputWithSuggestions;
