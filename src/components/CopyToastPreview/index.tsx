import type {ReactNode} from 'react';
import {ClipPreviewCaption, ClipPreviewItem, SAMPLE_CLIPS} from '../ClipPreview/shared';

export type CopyToastPreviewProps = {
  caption?: string;
};

/** Read-only copy-success toast sketch. */
export default function CopyToastPreview({
  caption = '示意：复制成功后的提示卡片（位置可在设置中改）。',
}: CopyToastPreviewProps): ReactNode {
  const item = SAMPLE_CLIPS[0];
  return (
    <div className="bc-preview">
      <div className="bc-preview-toast" role="status" aria-label="复制提示示意">
        <div className="bc-preview-toast-label">已复制</div>
        <ClipPreviewItem item={item} selected={false} />
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
