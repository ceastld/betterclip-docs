import {useCallback, useState, type ReactNode} from 'react';
import {
  ClipPreviewCaption,
  ClipPreviewItem,
  SAMPLE_CLIPS,
  usePreviewPlayback,
  type PreviewScheduler,
} from '../ClipPreview/shared';

export type CopyToastPreviewProps = {
  caption?: string;
};

/** Copy-success toast after content is written to the clipboard. */
export default function CopyToastPreview({
  caption = '示意：有内容写入剪贴板后弹出提示，便于确认内容和来源。位置可在设置中改。',
}: CopyToastPreviewProps): ReactNode {
  const [visible, setVisible] = useState(false);
  const item = SAMPLE_CLIPS[0];

  const play = useCallback((schedule: PreviewScheduler) => {
    setVisible(false);
    schedule(600, () => setVisible(true));
  }, []);

  const {replay} = usePreviewPlayback(play);

  return (
    <div className="bc-preview">
      <div className="bc-preview-controls">
        <button type="button" onClick={replay}>
          再演示
        </button>
      </div>
      <div className="bc-preview-desktop" style={{minHeight: 220}} role="img" aria-label="复制提示示意">
        <div className="bc-preview-app">
          <strong>网页</strong>
          刚复制了一段文字
        </div>
        {visible ? (
          <div
            className="bc-preview-toast is-in"
            style={{position: 'absolute', right: 16, bottom: 16}}
            role="status">
            <div className="bc-preview-toast-label">已复制 · {item.source}</div>
            <ClipPreviewItem item={item} selected={false} />
          </div>
        ) : null}
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
