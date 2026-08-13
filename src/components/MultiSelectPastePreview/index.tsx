import {useCallback, useState, type ReactNode} from 'react';
import {
  ClipPreviewCaption,
  ClipPreviewItem,
  ClipPreviewTitleBar,
  SAMPLE_CLIPS,
  usePreviewPlayback,
  type PreviewScheduler,
} from '../ClipPreview/shared';

export type MultiSelectPastePreviewProps = {
  caption?: string;
};

/**
 * Ctrl/Shift multi-select then 顺序粘贴 / 逆序粘贴, matching the list floating toolbar.
 */
export default function MultiSelectPastePreview({
  caption = '示意：Ctrl 逐条加选、Shift 范围选择。多选后出现「顺序粘贴 / 逆序粘贴」。此处按选择顺序写入左侧输入框。',
}: MultiSelectPastePreviewProps): ReactNode {
  const [selectedIds, setSelectedIds] = useState<string[]>(['2']);
  const [action, setAction] = useState<'ascending' | 'descending' | null>(null);
  const [pasted, setPasted] = useState('');

  const play = useCallback((schedule: PreviewScheduler) => {
    setSelectedIds(['2']);
    setAction(null);
    setPasted('');
    schedule(700, () => setSelectedIds(['2', '3']));
    schedule(1400, () => setAction('ascending'));
    schedule(1900, () => {
      setPasted(`${SAMPLE_CLIPS[1].text}\n${SAMPLE_CLIPS[2].text}`);
      setAction(null);
    });
  }, []);

  const {replay} = usePreviewPlayback(play);
  const multi = selectedIds.length > 1;

  return (
    <div className="bc-preview">
      <div className="bc-preview-controls">
        <button type="button" onClick={replay}>
          再演示
        </button>
      </div>
      <div className="bc-preview-desktop" role="img" aria-label="多选顺序粘贴示意">
        <div className="bc-preview-app">
          <strong>目标输入框</strong>
          {pasted ? (
            pasted.split('\n').map((line) => (
              <div key={line}>{line}</div>
            ))
          ) : (
            <>
              等待粘贴
              <span className="caret" />
            </>
          )}
        </div>
        <div
          className="bc-preview-window is-animating"
          style={{position: 'absolute', right: 12, top: 12, width: 268, height: 268}}>
          <ClipPreviewTitleBar active="clipboard" />
          <div className="bc-preview-body">
            <div className="bc-preview-list-shell">
              {multi ? (
                <div className="bc-preview-floating" aria-label="多选粘贴操作">
                  <button type="button" className={action === 'ascending' ? 'is-active' : undefined}>
                    顺序粘贴 <kbd>A</kbd>
                  </button>
                  <button type="button" className={action === 'descending' ? 'is-active' : undefined}>
                    逆序粘贴 <kbd>B</kbd>
                  </button>
                  <button type="button">
                    取消选择 <kbd>C</kbd>
                  </button>
                </div>
              ) : null}
              <ul className="list" role="listbox" aria-multiselectable="true" aria-label="多选列表示意">
                {SAMPLE_CLIPS.map((item) => (
                  <li key={item.id}>
                    <ClipPreviewItem item={item} selected={selectedIds.includes(item.id)} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
