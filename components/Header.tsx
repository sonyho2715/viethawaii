import Navigation from '@/components/Navigation';
import TopBar from '@/components/TopBar';

interface HeaderProps {
  businesses?: any[];
}

export default function Header({ businesses = [] }: HeaderProps) {
  return (
    <>
      <TopBar />
      <Navigation businesses={businesses} />
    </>
  );
}
