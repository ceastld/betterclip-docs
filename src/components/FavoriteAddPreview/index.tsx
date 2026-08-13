import {useCallback, useState, type ReactNode} from 'react';
import {
  ClipPreviewCaption,
  ClipPreviewItem,
  ClipPreviewTitleBar,
  SAMPLE_CLIPS,
  usePreviewPlayback,
  type PreviewScheduler,
} from '../ClipPreview/shared';

export type FavoriteAddPreviewProps = {
  caption?: string;
};

/**
 * Favorite from clipboard history, then switch to the 收藏 tab.
 */
export default function FavoriteAddPreview({
  caption = '示意：在历史条目上收藏后，可到「收藏」页反复使用。软件里通常走右键「收藏」，成功后可能再选收藏夹。',
}: FavoriteAddPreviewProps): ReactNode {
  const [tab, setTab] = useState<'clipboard' | 'favorites'>('clipboard');
  const [favoritedId, setFavoritedId] = useState<string | null>(null);
  const [toast, setToast] = useState(false);

  const play = useCallback((schedule: PreviewScheduler) => {
    setTab('clipboard');
    setFavoritedId(null);
    setToast(false);
    schedule(800, () => {
      setFavoritedId('2');
      setToast(true);
    });
    schedule(1600, () => {
      setToast(false);
      setTab('favorites');
    });
  }, []);

  const {replay} = usePreviewPlayback(play);
  const favoriteItems = SAMPLE_CLIPS.filter((item) => item.pinned || item.id === favoritedId);

  return (
    <div className="bc-preview">
      <div className="bc-preview-controls">
        <button type="button" onClick={replay}>
          再演示
        </button>
      </div>
      <div className="bc-preview-desktop" style={{minHeight: 300}} role="img" aria-label="添加收藏示意">
        <div
          className="bc-preview-window is-animating"
          style={{position: 'absolute', right: 16, top: 16, width: 268, height: 268}}>
          <ClipPreviewTitleBar active={tab} />
          <div className="bc-preview-body">
            <ul className="list" role="listbox" aria-label={tab === 'favorites' ? '收藏列表示意' : '剪贴板列表示意'}>
              {(tab === 'favorites' ? favoriteItems : SAMPLE_CLIPS).map((item) => (
                <li key={item.id}>
                  <ClipPreviewItem
                    item={item}
                    selected={tab === 'clipboard' ? item.id === '2' : item.id === favoritedId}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {toast ? (
          <div className="bc-preview-toast is-in" style={{position: 'absolute', left: 16, top: 24}} role="status">
            <div className="bc-preview-toast-label">已收藏</div>
            {SAMPLE_CLIPS[1].text}
          </div>
        ) : null}
      </div>
      {caption ? <ClipPreviewCaption>{caption}</ClipPreviewCaption> : null}
    </div>
  );
}
