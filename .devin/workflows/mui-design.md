---
description: MUI UI Design and Component Generation
---

# MUI Component Generation

## Basic Button Component
```tsx
import { Button } from '@mui/material';

<Button variant="contained" color="primary" onClick={handleClick}>
  Click Me
</Button>
```

## Card with Content
```tsx
import { Card, CardContent, CardHeader, CardActions, Button } from '@mui/material';

<Card>
  <CardHeader title="Card Title" subheader="Subtitle" />
  <CardContent>
    {/* Your content here */}
  </CardContent>
  <CardActions>
    <Button size="small">Learn More</Button>
  </CardActions>
</Card>
```

## Form with TextField
```tsx
import { TextField, Button, Box } from '@mui/material';
import { useState } from 'react';

export function MyForm() {
  const [value, setValue] = useState('');
  
  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField 
        label="Enter text" 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
      />
      <Button variant="contained">Submit</Button>
    </Box>
  );
}
```

## Dialog/Modal
```tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useState } from 'react';

export function MyDialog() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogContent>
          Your content here
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
```

## Data Table
```tsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Email</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((row) => (
        <TableRow key={row.id}>
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.email}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

## Responsive Grid Layout
```tsx
import { Grid, Box } from '@mui/material';

<Box sx={{ flexGrow: 1 }}>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={4}>
      {/* Column 1 */}
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      {/* Column 2 */}
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      {/* Column 3 */}
    </Grid>
  </Grid>
</Box>
```

## Styled Component with sx Prop
```tsx
import { Box, Typography } from '@mui/material';

<Box
  sx={{
    backgroundColor: 'primary.main',
    color: 'white',
    padding: 2,
    borderRadius: 1,
    '&:hover': {
      backgroundColor: 'primary.dark',
    },
  }}
>
  <Typography variant="h6">Styled Box</Typography>
</Box>
```

## Icon Button with Tooltip
```tsx
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

<Tooltip title="Edit">
  <IconButton onClick={handleEdit}>
    <EditIcon />
  </IconButton>
</Tooltip>
```

## Alert Component
```tsx
import { Alert, AlertTitle } from '@mui/material';

<Alert severity="error">
  <AlertTitle>Error</AlertTitle>
  This is an error message
</Alert>
```

## Responsive Typography
```tsx
import { Typography } from '@mui/material';

<Typography 
  variant="h4"
  sx={{
    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
  }}
>
  Responsive Heading
</Typography>
```

## Flexbox Layout
```tsx
import { Box } from '@mui/material';

<Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    flexWrap: 'wrap',
  }}
>
  {/* Items here */}
</Box>
```

## Theming with useTheme Hook
```tsx
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

export function MyComponent() {
  const theme = useTheme();
  
  return (
    <Box sx={{ color: theme.palette.primary.main }}>
      Using theme colors
    </Box>
  );
}
```

## Custom Styled Component
```tsx
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '12px 24px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default CustomButton;
```
