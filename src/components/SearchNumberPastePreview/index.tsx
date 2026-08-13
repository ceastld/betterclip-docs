import {useCallback, useState, type ReactNode} from 'react';
import {
  ClipPreviewCaption,
  ClipPreviewItem,
  ClipPreviewKeyHint,
  ClipPreviewSearchBar,
  ClipPreviewTitleBar,
  SAMPLE_CLIPS,
  usePreviewPlayback,
  type PreviewScheduler,
} from '../ClipPreview/shared';

export type SearchNumberPastePreviewProps = {
  caption?: string;
};

/**
 * Letters append into the toolbar search; digits paste a visible slot when search is empty.
 */
export default function SearchNumberPastePreview({
  caption = '示意：输入字母会写入搜索框；搜索为空时，数字键对应列表序号粘贴（1 为第一项，0 为第十项）。点「再演示」重播。',
}: SearchNumberPastePreviewProps): ReactNode {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('1');
  const [pasted, setPasted] = useState('');
  const [keyHint, setKeyHint] = useState<string | null>(null);

  const items = query.trim()
    ? SAMPLE_CLIPS.filter((item) => item.text.includes(query.trim()) || item.source.includes(query.trim()))
    : SAMPLE_CLIPS;

  const play = useCallback((schedule: PreviewScheduler) => {
    setQuery('');
    setSelectedId('1');
    setPasted('');
    setKeyHint(null);
    schedule(500, () => setKeyHint('会'));
    schedule(800, () => {
      setQuery('会');
      setKeyHint(null);
    });
    schedule(2200, () => setQuery(''));
    schedule(2700, () => setKeyHint('2'));
    schedule(3000, () => {
      setSelectedId('2');
      setKeyHint(null);
    });
    schedule(3400, () => setPasted(SAMPLE_CLIPS[1].text));
  }, []);

  const {replay} = usePreviewPlayback(play);

  return (
    <div className="bc-preview">
      <div className="bc-preview-controls">
        <button type="button" onClick={replay}>
          再演示
        </button>
      </div>
      <div className="bc-preview-desktop" role="img" aria-label="搜索与数字键粘贴示意">
        <div className="bc-preview-app">
          <strong>目标输入框</strong>
          {pasted || '正在输入'}
          <span className="caret" />
        </div>
        <div
          className="bc-preview-window is-animating"
          style={{position: 'absolute', right: 12, top: 12, width: 268, height: 268}}>
          <ClipPreviewTitleBar active="clipboard" />
          <div className="bc-preview-body">
            <ClipPreviewSearchBar value={query} />
            <ul className="list" role="listbox" aria-label="剪贴板列表示意">
              {items.map((item) => (
                <li key={item.id}>
                  <ClipPreviewItem item={item} selected={item.id === selectedId} query={query} />
                </li>
              ))}
            </ul>
          </div>
          <ClipPreviewKeyHint label={keyHint} />
        </div>
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
