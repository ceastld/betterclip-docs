import {useState, type ReactNode} from 'react';
import {ClipPreviewCaption, SAMPLE_CLIPS} from '../ClipPreview/shared';

export type QuickPastePreviewProps = {
  caption?: string;
};

/**
 * Read-only quick-paste overlay sketch (Alt+` session), not the full host overlay.
 */
export default function QuickPastePreview({
  caption = '示意：便捷粘贴浮层。用数字键或滚轮选条目；松开引导键后粘贴。此处点击只切换高亮。',
}: QuickPastePreviewProps): ReactNode {
  const [active, setActive] = useState(1);
  const rows = SAMPLE_CLIPS.slice(0, 4);

  return (
    <div className="bc-preview">
      <div className="bc-preview-desktop" style={{minHeight: 240}} role="img" aria-label="便捷粘贴浮层示意">
        <div className="bc-preview-app">
          <strong>目标输入框</strong>
          正在输入
          <span className="caret" />
        </div>
        <div className="bc-preview-qp" style={{right: 20, top: 36}}>
          {rows.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`bc-preview-qp-row${active === index ? ' is-active' : ''}`}
              onClick={() => setActive(index)}>
              <span className="bc-preview-qp-num">{index + 1}</span>
              <span>{item.text}</span>
            </button>
          ))}
          <div className="bc-preview-qp-hint">松开 Alt 粘贴 · 1 主操作 · Esc 取消</div>
        </div>
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
