import Navigation from '@/components/Navigation';

interface HeaderProps {
  businesses?: any[];
}

export default function Header({ businesses = [] }: HeaderProps) {
  return <Navigation businesses={businesses} />;
}
