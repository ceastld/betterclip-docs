import type {ReactNode} from 'react';
import './clip-ui.css';

export type ClipPreviewCaptionProps = {
  children: ReactNode;
};

export function ClipPreviewCaption({children}: ClipPreviewCaptionProps): ReactNode {
  return <p className="bc-preview-caption">{children}</p>;
}

type TitleBarProps = {
  active: 'clipboard' | 'favorites';
  onSelect?: (id: 'clipboard' | 'favorites') => void;
};

function CloseIcon(): ReactNode {
  return (
    <svg viewBox="0 0 12 12" aria-hidden>
      <path
        fill="currentColor"
        d="M2.2 1.4 6 5.2l3.8-3.8.8.8L6.8 6l3.8 3.8-.8.8L6 6.8 2.2 10.6l-.8-.8L5.2 6 1.4 2.2z"
      />
    </svg>
  );
}

export function ClipPreviewTitleBar({active, onSelect}: TitleBarProps): ReactNode {
  const tabs: Array<{id: 'clipboard' | 'favorites'; label: string}> = [
    {id: 'clipboard', label: '剪贴板'},
    {id: 'favorites', label: '收藏'},
  ];
  return (
    <div className="clip-host-titlebar">
      <div className="clip-host-titlebar-left">
        <div className="clip-host-titlebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`clip-host-titlebar-nav-link${active === tab.id ? ' is-active' : ''}`}
              onClick={() => onSelect?.(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="clip-host-titlebar-center" />
      <div className="clip-host-titlebar-right">
        <span className="clip-host-titlebar-btn" aria-hidden>
          <CloseIcon />
        </span>
      </div>
    </div>
  );
}

export type SampleItem = {
  id: string;
  index: number;
  source: string;
  text: string;
  kind: string;
  category: 'text' | 'image' | 'file' | 'star';
  pinned?: boolean;
};

export const SAMPLE_CLIPS: SampleItem[] = [
  {
    id: '1',
    index: 1,
    source: 'chrome',
    text: '会议纪要：下周一 10:00，带上上周进度',
    kind: '文本',
    category: 'star',
    pinned: true,
  },
  {
    id: '2',
    index: 2,
    source: 'Code',
    text: 'https://betterclip-docs.pages.dev/',
    kind: '文本',
    category: 'text',
  },
  {
    id: '3',
    index: 3,
    source: 'explorer',
    text: '季度报表.xlsx',
    kind: '文件',
    category: 'file',
  },
  {
    id: '4',
    index: 4,
    source: 'PixPin',
    text: '屏幕截图',
    kind: '图片',
    category: 'image',
  },
];

export function ClipPreviewItem({
  item,
  selected,
  onSelect,
}: {
  item: SampleItem;
  selected: boolean;
  onSelect?: (id: string) => void;
}): ReactNode {
  return (
    <div
      className={`item${item.pinned ? ' item-top' : ''}${selected ? ' item-selected' : ''}`}
      onClick={() => onSelect?.(item.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.(item.id);
        }
      }}
        role={onSelect ? 'option' : undefined}
        aria-selected={onSelect ? selected : undefined}
        tabIndex={onSelect ? 0 : undefined}>
      <div className="item-header">
        <div className="item-title-wrap">
          <span className="item-index">{item.index}</span>
          <span className="item-title">{item.source}</span>
        </div>
      </div>
      <div className="item-main">
        {item.category === 'image' ? (
          <div className="item-image-ph" aria-hidden />
        ) : item.category === 'file' ? (
          <span className="item-file-chip">{item.text}</span>
        ) : (
          <div className="primary-text">{item.text}</div>
        )}
        <span className="kind kind--item-float">{item.kind}</span>
      </div>
    </div>
  );
}
