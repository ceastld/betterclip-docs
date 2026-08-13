import {useCallback, useState, type ReactNode} from 'react';
import {
  ClipPreviewCaption,
  ClipPreviewItem,
  ClipPreviewTitleBar,
  SAMPLE_CLIPS,
  usePreviewPlayback,
  type PreviewScheduler,
} from '../ClipPreview/shared';

export type DragOutPreviewProps = {
  caption?: string;
};

const FILE = SAMPLE_CLIPS[2];

/**
 * Drag a file/image clip out of the list into Explorer (copy, not via clipboard).
 */
export default function DragOutPreview({
  caption = '示意：把文件或图片条目拖到资源管理器等窗口，会复制一份到目标位置。需要本机拖放能力可用。',
}: DragOutPreviewProps): ReactNode {
  const [dragging, setDragging] = useState(false);
  const [dropped, setDropped] = useState(false);
  const [ghost, setGhost] = useState({left: 210, top: 118, opacity: 0});

  const play = useCallback((schedule: PreviewScheduler) => {
    setDragging(false);
    setDropped(false);
    setGhost({left: 210, top: 118, opacity: 0});
    schedule(500, () => {
      setDragging(true);
      setGhost({left: 210, top: 118, opacity: 1});
    });
    schedule(700, () => setGhost({left: 28, top: 168, opacity: 1}));
    schedule(1500, () => {
      setDropped(true);
      setGhost((prev) => ({...prev, opacity: 0}));
    });
    schedule(1800, () => setDragging(false));
  }, []);

  const {replay} = usePreviewPlayback(play);

  return (
    <div className="bc-preview">
      <div className="bc-preview-controls">
        <button type="button" onClick={replay}>
          再演示
        </button>
      </div>
      <div className="bc-preview-desktop" role="img" aria-label="拖出文件示意">
        <div className={`bc-preview-folder${dropped ? ' is-drop' : ''}`}>
          {dropped ? '已复制到文件夹' : '资源管理器'}
        </div>
        <div
          className="bc-preview-window is-animating"
          style={{position: 'absolute', right: 12, top: 12, width: 250, height: 248}}>
          <ClipPreviewTitleBar active="clipboard" />
          <div className="bc-preview-body">
            <ul className="list">
              {SAMPLE_CLIPS.slice(2, 4).map((item) => (
                <li key={item.id}>
                  <ClipPreviewItem item={item} selected={item.id === FILE.id} dimmed={dragging && item.id === FILE.id} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {ghost.opacity > 0 ? (
          <div className="bc-preview-drag-ghost" style={{left: ghost.left, top: ghost.top, opacity: ghost.opacity}}>
            {FILE.text}
          </div>
        ) : null}
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
