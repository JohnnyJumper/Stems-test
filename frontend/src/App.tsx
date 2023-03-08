import React, { useState } from "react";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputWithSuggestions from "./SuggestionForm";
interface Suggestion {
  value: string;
  label: string;
}

interface BackendError {
  message: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
  },
  mainContainer: {
    background: "#343746",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "80%",
    alignSelf: "center",
  },
  screen: {
    padding: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: "30px",
    borderTopRightRadius: "30px",
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
  },
}));

function App() {
  const classes = useStyles();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>();

  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);
    setSelectedBook(value);
  };

  const fetchSuggestions = async (input: string) => {
    if (!input) {
      return;
    }
    const suggestions: string[] | BackendError = await fetch(
      `http://localhost:6357/search/${input}`,
      {
        method: "GET",
      }
    ).then((r) => r.json());
    if (isBackendError(suggestions)) {
      return;
    }
    const update: Suggestion[] = [];
    for (const suggestion of suggestions) {
      update.push({
        label: suggestion,
        value: suggestion,
      });
    }
    setSuggestions(update);
  };

  const isBackendError = (input: any): input is BackendError => {
    return !!input && !!input.message;
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.mainContainer}>
        {selectedBook && (
          <Typography variant="h4">
            Your chosen book is: {selectedBook}
          </Typography>
        )}
        {!selectedBook && (
          <Typography variant="h4">Please choose your book</Typography>
        )}
        <div className={classes.screen}>
          <InputWithSuggestions
            label="Write your book name"
            suggestions={suggestions}
            onSelect={handleSelect}
            onInputChange={fetchSuggestions}
          />
        </div>
      </div>
    </Paper>
  );
}

export default App;
