import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import {ClipPreviewCaption, ClipPreviewItem, ClipPreviewTitleBar, SAMPLE_CLIPS} from '../ClipPreview/shared';

export type DismissMode = 'hide' | 'edge' | 'fold';

export type DismissModePreviewProps = {
  caption?: string;
};

const MODES: Array<{id: DismissMode; label: string}> = [
  {id: 'hide', label: '普通隐藏'},
  {id: 'edge', label: '贴边隐藏'},
  {id: 'fold', label: '自动折叠'},
];

/**
 * Animated sketch of ClipHost dismiss behaviors (Hide / EdgeHide / Fold).
 * Does not claim a product default; the selected mode is only for the demo.
 */
export default function DismissModePreview({
  caption = '示意：失焦后窗口如何收起。点模式后会自动演示一次，不会改你软件里的设置。',
}: DismissModePreviewProps): ReactNode {
  const [mode, setMode] = useState<DismissMode>('fold');
  const [phase, setPhase] = useState<'shown' | 'dismissed'>('shown');
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) {
      window.clearTimeout(id);
    }
    timers.current = [];
  }, []);

  const play = useCallback(
    (nextMode: DismissMode) => {
      clearTimers();
      setMode(nextMode);
      setPhase('shown');
      timers.current.push(
        window.setTimeout(() => setPhase('dismissed'), 900),
        window.setTimeout(() => setPhase('shown'), 2400),
      );
    },
    [clearTimers],
  );

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      return undefined;
    }
    play('fold');
    return clearTimers;
  }, [play, clearTimers]);

  const windowClass = [
    'bc-preview-window',
    'is-animating',
    phase === 'dismissed' && mode === 'hide' ? 'is-hidden' : '',
    phase === 'dismissed' && mode === 'edge' ? 'is-edge' : '',
    phase === 'dismissed' && mode === 'fold' ? 'is-folded' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="bc-preview">
      <div className="bc-preview-controls">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={mode === item.id ? 'is-active' : undefined}
            onClick={() => play(item.id)}>
            {item.label}
          </button>
        ))}
        <button type="button" onClick={() => play(mode)}>
          再演示
        </button>
      </div>
      <div className="bc-preview-desktop" role="img" aria-label="窗口失焦行为示意">
        <div className="bc-preview-app">
          <strong>正在编辑的窗口</strong>
          失焦演示中，剪贴板在右侧。
        </div>
        <div
          className={windowClass}
          style={{
            position: 'absolute',
            right: 16,
            top: 16,
            width: 250,
            height: 248,
          }}>
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
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
