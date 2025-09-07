import TextField from "@mui/material/TextField";
import "./App.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function App() {
  return (
    <Box
      component="form"
      id="form"
      sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}
    >
      <TextField id="outlined-basic" label="Заклад" variant="outlined" />
      <TextField
        id="outlined-basic"
        multiline
        label="Замовлення"
        variant="outlined"
        maxRows={6}
      />
      <TextField
        id="outlined-basic"
        multiline
        label="Коментар"
        variant="outlined"
        maxRows={4}
      />
      <Button type="submit" variant="contained">
        Підтвердити
      </Button>
    </Box>
  );
}

export default App;
