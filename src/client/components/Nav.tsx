import { PropsWithChildren } from 'react';

export interface NavTabsProps extends PropsWithChildren {
  id: string;
}

export interface NavItemProps extends PropsWithChildren {
  id: string;
  isActive?: boolean;
}

export const TabItem = ({ id, isActive, children }: NavItemProps) => {
  return (
    <li className="nav-item" role="presentation">
      <button
        className={`nav-link ${isActive ? 'active' : ''}`}
        id={`${id}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#${id}-tab-pane`}
        type="button"
        role="tab"
        aria-controls={`${id}-tab-pane`}
        aria-selected="true"
      >
        {children}
      </button>
    </li>
  );
};

export const Tabs = ({ id, children }: NavTabsProps) => {
  return (
    <ul className="nav nav-tabs" id={id} role="tablist">
      {children}
    </ul>
  );
};

export const TabContentItem = ({ id, children, isActive }: NavItemProps) => {
  return (
    <div
      className={`tab-pane fade show ${isActive ? 'active' : ''}`}
      id={`${id}-tab-pane`}
      role="tabpanel"
      aria-labelledby={`${id}-tab`}
    >
      {children}
    </div>
  );
};

export const TabsContent = ({ id, children }: NavTabsProps) => {
  return (
    <div className="tab-content" id={`${id}Content`}>
      {children}
    </div>
  );
};
