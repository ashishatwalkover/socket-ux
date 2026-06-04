# Windsurf Custom Instructions

## MUI Design Guidelines

### Component Imports
Always import MUI components from `@mui/material`:
```tsx
import { Button, Card, TextField, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
```

Icons from `@mui/icons-material`:
```tsx
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
```

### Styling Approach (Preferred Order)
1. **sx prop** - For one-off component styling (most common)
   ```tsx
   <Box sx={{ padding: 2, backgroundColor: 'primary.main' }} />
   ```

2. **styled components** - For reusable styled components
   ```tsx
   const StyledBox = styled(Box)(({ theme }) => ({
     padding: theme.spacing(2),
     backgroundColor: theme.palette.primary.main,
   }));
   ```

3. **CSS modules** - For complex, scoped styles (only if necessary)

### Responsive Design
Use MUI breakpoints in sx prop:
```tsx
sx={{
  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
  padding: { xs: 1, sm: 2, md: 3 },
}}
```

Breakpoints: `xs` (0px), `sm` (600px), `md` (960px), `lg` (1280px), `xl` (1920px)

### Spacing
Use MUI spacing scale (theme.spacing):
- `spacing(1)` = 8px
- `spacing(2)` = 16px
- `spacing(3)` = 24px
- etc.

```tsx
sx={{ padding: 2, gap: 1.5 }}
```

### Colors
Use theme palette colors instead of hardcoding:
```tsx
// Good
sx={{ color: 'primary.main', backgroundColor: 'secondary.light' }}

// Avoid
sx={{ color: '#1976d2', backgroundColor: '#f3e5f5' }}
```

Available: `primary`, `secondary`, `error`, `warning`, `info`, `success`, `text`, `background`

### Typography Variants
Use semantic typography variants:
```tsx
<Typography variant="h1">Main Heading</Typography>
<Typography variant="h4">Section Heading</Typography>
<Typography variant="body1">Body text</Typography>
<Typography variant="caption">Small text</Typography>
```

### Icon Usage
Always use MUI icons with consistent sizing:
```tsx
<IconButton>
  <EditIcon sx={{ fontSize: 20 }} />
</IconButton>

<Button startIcon={<SaveIcon />}>Save</Button>
```

### Form Components
Use MUI form components with proper validation:
```tsx
<TextField
  label="Email"
  type="email"
  error={!!errors.email}
  helperText={errors.email}
  fullWidth
  variant="outlined"
/>
```

### Layout Patterns
Use Grid for responsive layouts:
```tsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    {/* Content */}
  </Grid>
</Grid>
```

Use Box for flexbox layouts:
```tsx
<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
  {/* Items */}
</Box>
```

### TypeScript with MUI
Always type component props:
```tsx
import { FC } from 'react';
import { BoxProps } from '@mui/material';

const MyComponent: FC<BoxProps> = (props) => {
  return <Box {...props} />;
};
```

### Theme Usage
Access theme in styled components and hooks:
```tsx
const StyledBox = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  padding: theme.spacing(2),
}));

// In components
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
```

### Common Patterns

**Loading State:**
```tsx
<Button disabled={loading}>
  {loading ? <CircularProgress size={20} /> : 'Submit'}
</Button>
```

**Error Handling:**
```tsx
<Alert severity="error">
  <AlertTitle>Error</AlertTitle>
  {errorMessage}
</Alert>
```

**Modal/Dialog:**
```tsx
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Title</DialogTitle>
  <DialogContent>{content}</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm} variant="contained">Confirm</Button>
  </DialogActions>
</Dialog>
```

### Performance Tips
- Use `useMemo` for expensive computations
- Use `useCallback` for event handlers passed to MUI components
- Lazy load dialogs and modals
- Use `sx` prop instead of creating new styled components in render

### Accessibility
- Always include `aria-label` on icon buttons
- Use semantic HTML with MUI components
- Ensure color contrast meets WCAG standards
- Test with keyboard navigation

### Code Organization
1. Imports at top (React, MUI, icons, utilities)
2. Type definitions
3. Styled components
4. Component function
5. Exports

```tsx
import { FC } from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MyComponentProps {
  title: string;
}

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const MyComponent: FC<MyComponentProps> = ({ title }) => {
  return <StyledBox>{title}</StyledBox>;
};

export default MyComponent;
```
