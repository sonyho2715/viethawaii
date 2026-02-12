import React from 'react';
import { render } from '@testing-library/react';
import StructuredData from '@/components/public/StructuredData';

describe('StructuredData Component', () => {
  it('renders a script tag with type application/ld+json', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Person', name: 'Test User' };
    const { container } = render(<StructuredData data={data} />);
    
    const scriptTag = container.querySelector('script');
    expect(scriptTag).toBeInTheDocument();
    expect(scriptTag).toHaveAttribute('type', 'application/ld+json');
    expect(scriptTag?.innerHTML).toBe(JSON.stringify(data));
  });
});
