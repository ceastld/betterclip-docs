import {useCallback, useState, type ReactNode} from 'react';
import {
  ClipPreviewCaption,
  ClipPreviewItem,
  ClipPreviewTitleBar,
  SAMPLE_CLIPS,
  usePreviewPlayback,
  type PreviewScheduler,
} from '../ClipPreview/shared';

export type NoFocusPreviewProps = {
  caption?: string;
};

/**
 * No-focus mode: clipboard stays usable while the target editor keeps the caret.
 */
export default function NoFocusPreview({
  caption = '示意：无焦点模式下，剪贴板不抢占前台应用。可以在列表里选条目粘贴，左侧输入框仍保持光标。',
}: NoFocusPreviewProps): ReactNode {
  const [selectedId, setSelectedId] = useState('1');
  const [pasted, setPasted] = useState('');

  const play = useCallback((schedule: PreviewScheduler) => {
    setSelectedId('1');
    setPasted('');
    schedule(900, () => setSelectedId('2'));
    schedule(1400, () => setPasted(SAMPLE_CLIPS[1].text));
  }, []);

  const {replay} = usePreviewPlayback(play);

  return (
    <div className="bc-preview">
      <div className="bc-preview-controls">
        <button type="button" onClick={replay}>
          再演示
        </button>
      </div>
      <div className="bc-preview-desktop" role="img" aria-label="无焦点模式示意">
        <div className="bc-preview-app">
          <strong>前台输入框（仍有焦点）</strong>
          {pasted || '继续在这里打字'}
          <span className="caret" />
        </div>
        <div
          className="bc-preview-window is-animating"
          style={{position: 'absolute', right: 12, top: 12, width: 250, height: 248}}>
          <ClipPreviewTitleBar active="clipboard" />
          <div className="bc-preview-body">
            <ul className="list" role="listbox" aria-label="无焦点列表示意">
              {SAMPLE_CLIPS.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <ClipPreviewItem item={item} selected={item.id === selectedId} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
