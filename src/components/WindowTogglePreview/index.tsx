import {useCallback, useState, type ReactNode} from 'react';
import {
  ClipPreviewCaption,
  ClipPreviewItem,
  ClipPreviewKeyHint,
  ClipPreviewTitleBar,
  SAMPLE_CLIPS,
  usePreviewPlayback,
  type PreviewScheduler,
} from '../ClipPreview/shared';

export type WindowTogglePreviewProps = {
  caption?: string;
};

type Phase = 'hidden' | 'background' | 'focused';

/**
 * Same show/hide hotkey: closed → open, already in front → hide.
 * Background (visible but not engaged) is shown as a dimmed window being brought forward.
 */
export default function WindowTogglePreview({
  caption = '示意：同一「显示/隐藏剪贴板窗口」热键。未显示则打开；被挡住则拿到前台；已在前台则收起。具体组合以你在设置里保存的为准。',
}: WindowTogglePreviewProps): ReactNode {
  const [phase, setPhase] = useState<Phase>('hidden');
  const [keyHint, setKeyHint] = useState<string | null>(null);

  const play = useCallback((schedule: PreviewScheduler) => {
    setPhase('hidden');
    setKeyHint(null);
    schedule(500, () => setKeyHint('热键'));
    schedule(800, () => {
      setPhase('focused');
      setKeyHint(null);
    });
    schedule(1800, () => setPhase('background'));
    schedule(2300, () => setKeyHint('热键'));
    schedule(2600, () => {
      setPhase('focused');
      setKeyHint(null);
    });
    schedule(3600, () => setKeyHint('热键'));
    schedule(3900, () => {
      setPhase('hidden');
      setKeyHint(null);
    });
  }, []);

  const {replay} = usePreviewPlayback(play);

  const windowClass = [
    'bc-preview-window',
    'is-animating',
    phase === 'hidden' ? 'is-hidden' : '',
    phase === 'background' ? 'is-background' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="bc-preview">
      <div className="bc-preview-controls">
        <button type="button" onClick={replay}>
          再演示
        </button>
      </div>
      <div className="bc-preview-desktop" role="img" aria-label="显示或隐藏剪贴板窗口示意">
        <div className="bc-preview-app">
          <strong>正在编辑的窗口</strong>
          {phase === 'focused' ? '剪贴板在前台' : phase === 'background' ? '剪贴板被挡住了' : '剪贴板已收起'}
        </div>
        <div
          className={windowClass}
          style={{position: 'absolute', right: 16, top: 16, width: 250, height: 248}}>
          <ClipPreviewTitleBar active="clipboard" />
          <div className="bc-preview-body">
            <ul className="list">
              {SAMPLE_CLIPS.slice(0, 2).map((item, index) => (
                <li key={item.id}>
                  <ClipPreviewItem item={item} selected={index === 0} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ClipPreviewKeyHint label={keyHint} />
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
