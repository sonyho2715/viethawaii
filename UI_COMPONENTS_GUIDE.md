# UI Components Guide

This guide covers all the modern UI components available in the VietHawaii application.

## Table of Contents
- [Toast Notifications](#toast-notifications)
- [Loading Skeletons](#loading-skeletons)
- [Button Component](#button-component)
- [Input Component](#input-component)
- [Modal Component](#modal-component)
- [Badge Component](#badge-component)

---

## Toast Notifications

Display temporary notifications to users with automatic dismissal.

### Usage

```tsx
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';

function MyComponent() {
  const { toasts, success, error, warning, info, close } = useToast();

  const handleAction = () => {
    success('Operation completed successfully!');
    // or
    error('Something went wrong!');
    // or
    warning('Please review your input');
    // or
    info('New update available');
  };

  return (
    <>
      <button onClick={handleAction}>Show Toast</button>
      <ToastContainer toasts={toasts} onClose={close} />
    </>
  );
}
```

### Features
- 4 variants: success, error, warning, info
- Auto-dismiss after 5 seconds (customizable)
- Manual close button
- Stacked notifications
- Accessible (ARIA live regions)

---

## Loading Skeletons

Show placeholder content while data is loading.

### Available Skeletons

#### BusinessCardSkeleton
```tsx
import { BusinessCardSkeleton } from '@/components/LoadingSkeletons';

<BusinessCardSkeleton />
```

#### BusinessDetailSkeleton
```tsx
import { BusinessDetailSkeleton } from '@/components/LoadingSkeletons';

<BusinessDetailSkeleton />
```

#### ReviewSkeleton
```tsx
import { ReviewSkeleton } from '@/components/LoadingSkeletons';

<ReviewSkeleton />
```

#### TableSkeleton
```tsx
import { TableSkeleton } from '@/components/LoadingSkeletons';

<TableSkeleton rows={5} columns={4} />
```

#### FormSkeleton
```tsx
import { FormSkeleton } from '@/components/LoadingSkeletons';

<FormSkeleton />
```

#### GridSkeleton
```tsx
import { GridSkeleton } from '@/components/LoadingSkeletons';

<GridSkeleton items={6} />
```

---

## Button Component

Reusable button with variants, sizes, and loading states.

### Usage

```tsx
import Button from '@/components/Button';

// Primary button
<Button variant="primary">Click Me</Button>

// With loading state
<Button loading={isLoading}>Submit</Button>

// With icon
<Button
  icon={
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="..." />
    </svg>
  }
>
  Save
</Button>

// Different variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Approve</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

### Props
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean
- `icon`: ReactNode
- All standard button HTML attributes

---

## Input Component

Enhanced input field with labels, validation, and icons.

### Usage

```tsx
import Input from '@/components/Input';

// Basic input
<Input
  id="email"
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  required
/>

// With validation error
<Input
  id="name"
  label="Full Name"
  error="Name must be at least 2 characters"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// With help text
<Input
  id="username"
  label="Username"
  helpText="Choose a unique username"
  placeholder="johndoe"
/>

// With icon
<Input
  id="search"
  label="Search"
  icon={
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="..." />
    </svg>
  }
  placeholder="Search businesses..."
/>

// Disabled state
<Input
  id="readonly"
  label="Read Only"
  value="Cannot edit"
  disabled
/>
```

### Props
- `label`: string
- `error`: string
- `helpText`: string
- `icon`: ReactNode
- All standard input HTML attributes

### Accessibility
- Proper label association
- ARIA attributes for errors
- Required field indicators
- Focus management

---

## Modal Component

Reusable modal dialog with various sizes.

### Usage

```tsx
import { useState } from 'react';
import Modal from '@/components/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        size="md"
      >
        <p>Are you sure you want to continue?</p>
        <div className="flex gap-4 mt-6">
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          <button onClick={handleConfirm}>Confirm</button>
        </div>
      </Modal>
    </>
  );
}
```

### Features
- Click outside to close
- ESC key to close
- Scrollable content for long modals
- 4 sizes: sm, md, lg, xl
- Optional close button
- Prevents body scroll when open
- Portal rendering

### Props
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `showCloseButton`: boolean (default: true)

---

## Badge Component

Small status indicators and labels.

### Usage

```tsx
import Badge from '@/components/Badge';

// Basic badge
<Badge>New</Badge>

// Variants
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Rejected</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="purple">Featured</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// With icon
<Badge
  variant="success"
  icon={
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="..." />
    </svg>
  }
>
  Verified
</Badge>
```

### Props
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: ReactNode

---

## Custom Animations

The following CSS animations are available via Tailwind classes:

```tsx
// Fade in
<div className="animate-fade-in">Content</div>

// Slide in from right
<div className="animate-slide-in">Content</div>

// Slide up
<div className="animate-slide-up">Content</div>

// Slide down
<div className="animate-slide-down">Content</div>
```

---

## Best Practices

### 1. Consistent Error Handling
```tsx
const { error, success } = useToast();

try {
  await someAction();
  success('Action completed successfully!');
} catch (err) {
  error('Failed to complete action');
}
```

### 2. Loading States
```tsx
const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={handleSubmit}>
  Submit
</Button>
```

### 3. Form Validation
```tsx
<Input
  id="email"
  type="email"
  label="Email"
  error={errors.email}
  required
/>
```

### 4. Accessible Modals
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Important Action"
>
  {/* Modal content */}
</Modal>
```

### 5. Status Indicators
```tsx
<Badge variant={status === 'active' ? 'success' : 'warning'}>
  {status}
</Badge>
```

---

## Examples

### Complete Form with Toast

```tsx
import { useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';

function MyForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { toasts, success, error, close } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors(data.errors);
        error('Please fix the errors');
        return;
      }

      success('Form submitted successfully!');
      setEmail('');
    } catch (err) {
      error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <Button type="submit" loading={loading} fullWidth>
          Submit
        </Button>
      </form>

      <ToastContainer toasts={toasts} onClose={close} />
    </>
  );
}
```

### Data Table with Skeleton

```tsx
import { useState, useEffect } from 'react';
import { TableSkeleton } from '@/components/LoadingSkeletons';
import Badge from '@/components/Badge';

function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <TableSkeleton rows={10} columns={5} />;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>
              <Badge variant={item.active ? 'success' : 'danger'}>
                {item.status}
              </Badge>
            </td>
            <td>
              <Button size="sm">Edit</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Summary

These UI components provide a consistent, accessible, and modern user interface for the VietHawaii application. They handle common patterns like loading states, user feedback, forms, and dialogs, making development faster and more maintainable.
