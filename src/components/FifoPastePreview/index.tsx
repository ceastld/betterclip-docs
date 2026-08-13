import {useCallback, useState, type ReactNode} from 'react';
import {
  ClipPreviewCaption,
  SAMPLE_CLIPS,
  usePreviewPlayback,
  type PreviewScheduler,
} from '../ClipPreview/shared';

export type FifoPastePreviewProps = {
  caption?: string;
};

const QUEUE = SAMPLE_CLIPS.slice(0, 3);

/**
 * Sketch of the 连续粘贴（先进先出） queue panel: earliest first, 终点 badge, then paste in order.
 */
export default function FifoPastePreview({
  caption = '示意：连续粘贴（先进先出）。最早在上；贴完一条再贴下一条。便捷粘贴里按 Q 也可以武装同一队列。',
}: FifoPastePreviewProps): ReactNode {
  const [doneCount, setDoneCount] = useState(0);
  const [starting, setStarting] = useState(false);
  const [visible, setVisible] = useState(true);

  const play = useCallback((schedule: PreviewScheduler) => {
    setDoneCount(0);
    setStarting(false);
    setVisible(true);
    schedule(700, () => setStarting(true));
    schedule(1100, () => {
      setStarting(false);
      setDoneCount(1);
    });
    schedule(1900, () => setDoneCount(2));
    schedule(2700, () => setDoneCount(3));
    schedule(3200, () => setVisible(false));
  }, []);

  const {replay} = usePreviewPlayback(play);
  const pasted = QUEUE.slice(0, doneCount);

  return (
    <div className="bc-preview">
      <div className="bc-preview-controls">
        <button type="button" onClick={replay}>
          再演示
        </button>
      </div>
      <div className="bc-preview-desktop" role="img" aria-label="连续粘贴队列示意">
        <div className="bc-preview-app">
          <strong>目标输入框</strong>
          {pasted.length === 0 ? (
            <>
              等待开始
              <span className="caret" />
            </>
          ) : (
            pasted.map((item) => <div key={item.id}>{item.text}</div>)
          )}
        </div>
        {visible ? (
          <div className="bc-preview-fifo" style={{position: 'absolute', right: 14, top: 18}}>
            <div className="bc-preview-fifo-title">连续粘贴（先进先出）</div>
            <div className="bc-preview-fifo-hint">最早在上，点一行可裁掉更早的条目</div>
            {QUEUE.map((item, index) => {
              const isEnd = index === QUEUE.length - 1;
              const done = index < doneCount;
              const isStart = index === doneCount && doneCount < QUEUE.length;
              return (
                <div
                  key={item.id}
                  className={`bc-preview-fifo-row${done ? ' is-done' : ''}${isStart ? ' is-start' : ''}`}>
                  <span className="bc-preview-fifo-index">{index + 1}</span>
                  <span className="bc-preview-fifo-text">{item.text}</span>
                  {isEnd ? <span className="bc-preview-fifo-badge">终点</span> : null}
                </div>
              );
            })}
            <div className="bc-preview-fifo-actions">
              <button type="button" className={starting ? 'is-active is-primary' : 'is-primary'}>
                开始
              </button>
              <button type="button">取消</button>
            </div>
          </div>
        ) : null}
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
