import {useCallback, useEffect, useRef, type ReactNode} from 'react';
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

export function highlightQuery(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) {
    return text;
  }
  const index = text.toLowerCase().indexOf(q.toLowerCase());
  if (index < 0) {
    return text;
  }
  return (
    <>
      {text.slice(0, index)}
      <mark className="bc-preview-hit">{text.slice(index, index + q.length)}</mark>
      {text.slice(index + q.length)}
    </>
  );
}

export function ClipPreviewItem({
  item,
  selected,
  onSelect,
  query,
  dimmed,
}: {
  item: SampleItem;
  selected: boolean;
  onSelect?: (id: string) => void;
  query?: string;
  dimmed?: boolean;
}): ReactNode {
  return (
    <div
      className={`item${item.pinned ? ' item-top' : ''}${selected ? ' item-selected' : ''}${dimmed ? ' is-dimmed' : ''}`}
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
          <span className="item-file-chip">{highlightQuery(item.text, query ?? '')}</span>
        ) : (
          <div className="primary-text">{highlightQuery(item.text, query ?? '')}</div>
        )}
        <span className="kind kind--item-float">{item.kind}</span>
      </div>
    </div>
  );
}

export function ClipPreviewSearchBar({
  value,
  placeholder = '搜索历史内容',
}: {
  value: string;
  placeholder?: string;
}): ReactNode {
  return (
    <div className="toolbar-clipboard-search">
      <input
        className="filterbox-input"
        value={value}
        placeholder={placeholder}
        readOnly
        aria-label="搜索示意"
      />
    </div>
  );
}

export function ClipPreviewKeyHint({label}: {label: string | null}): ReactNode {
  if (!label) {
    return null;
  }
  return (
    <span className="bc-preview-key" aria-hidden>
      {label}
    </span>
  );
}

export type PreviewScheduler = (ms: number, fn: () => void) => void;

/**
 * Runs a scripted docs preview. Skips autoplay when the user prefers reduced motion.
 */
export function usePreviewPlayback(play: (schedule: PreviewScheduler) => void): {replay: () => void} {
  const timers = useRef<number[]>([]);
  const playRef = useRef(play);
  playRef.current = play;

  const clear = useCallback(() => {
    for (const id of timers.current) {
      window.clearTimeout(id);
    }
    timers.current = [];
  }, []);

  const replay = useCallback(() => {
    clear();
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      playRef.current((_ms, fn) => {
        fn();
      });
      return;
    }
    const schedule: PreviewScheduler = (ms, fn) => {
      timers.current.push(window.setTimeout(fn, ms));
    };
    playRef.current(schedule);
  }, [clear]);

  useEffect(() => {
    replay();
    return clear;
  }, [replay, clear]);

  return {replay};
}
