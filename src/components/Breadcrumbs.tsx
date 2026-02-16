import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className='breadcrumbs'>
      {items.map((item, index) => {
        const esteUltimul = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className='breadcrumb-item'>
            {item.to && !esteUltimul ? <Link to={item.to}>{item.label}</Link> : <strong>{item.label}</strong>}
            {!esteUltimul ? <span className='separator'>/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
