import {useMemo, useState, type ReactNode} from 'react';
import {ClipPreviewCaption, ClipPreviewItem, ClipPreviewTitleBar, SAMPLE_CLIPS} from '../ClipPreview/shared';

const CATEGORIES = ['默认', '星标', '文本', '图片', '文件'] as const;

export type ClipboardWindowPreviewProps = {
  caption?: string;
  /** CSS height of the simulated window. */
  height?: number;
};

/**
 * Read-only ClipHost clipboard window sketch for docs.
 * Tokens/layout sliced from IntelliTools.Frontend app.css.
 */
export default function ClipboardWindowPreview({
  caption = '示意：剪贴板历史窗口。点分类或条目仅用于浏览，不会真正粘贴。',
  height = 340,
}: ClipboardWindowPreviewProps): ReactNode {
  const [tab, setTab] = useState<'clipboard' | 'favorites'>('clipboard');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('默认');
  const [selectedId, setSelectedId] = useState('2');

  const items = useMemo(() => {
    if (tab === 'favorites') {
      return SAMPLE_CLIPS.filter((item) => item.pinned || item.category === 'star');
    }
    if (category === '星标') {
      return SAMPLE_CLIPS.filter((item) => item.pinned || item.category === 'star');
    }
    if (category === '文本') {
      return SAMPLE_CLIPS.filter((item) => item.category === 'text' || item.category === 'star');
    }
    if (category === '图片') {
      return SAMPLE_CLIPS.filter((item) => item.category === 'image');
    }
    if (category === '文件') {
      return SAMPLE_CLIPS.filter((item) => item.category === 'file');
    }
    return SAMPLE_CLIPS;
  }, [tab, category]);

  return (
    <div className="bc-preview">
      <div
        className="bc-preview-window"
        style={{height}}
        role="img"
        aria-label="BetterClip 剪贴板窗口示意">
        <ClipPreviewTitleBar active={tab} onSelect={setTab} />
        <div className="bc-preview-body">
          {tab === 'clipboard' ? (
            <div className="toolbar-categories">
              <div className="category-tabs">
                {CATEGORIES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={category === name ? 'is-active' : undefined}
                    onClick={() => setCategory(name)}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <ul className="list" role="listbox" aria-label={tab === 'favorites' ? '收藏列表示意' : '剪贴板列表示意'}>
            {items.map((item) => (
              <li key={item.id}>
                <ClipPreviewItem
                  item={item}
                  selected={item.id === selectedId}
                  onSelect={setSelectedId}
                />
              </li>
            ))}
          </ul>
          <div className="toolbar app-bottom-toolbar">
            <div className="app-bottom-toolbar-list-stats">
              <span>总数: {items.length}</span>
              <span>已加载: {items.length}</span>
            </div>
            <div className="app-bottom-toolbar-actions">
              <button type="button">添加</button>
              <button type="button">清空</button>
            </div>
          </div>
        </div>
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
