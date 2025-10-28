import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAnnouncements } from '../hooks/useAnnouncements';

export const AnnouncementBanner: React.FC = () => {
  const { language } = useLanguage();
  const { data: announcements } = useAnnouncements();
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());

  // 表示可能な告知のみフィルタリング
  const visibleAnnouncements = announcements.filter(
    (announcement) => 
      !dismissed.has(announcement.id) &&
      announcement.is_visible &&
      !announcement.deleted_at
  );

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  return (
    <div className="space-y-2">
      {visibleAnnouncements.map((announcement) => (
        <div
          key={announcement.id}
          className="relative px-4 py-3 rounded-lg shadow-md animate-fade-in"
          style={{
            backgroundColor: announcement.background_color,
            color: announcement.text_color,
          }}
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm mb-1">
                {language === 'zh' && announcement.title_zh
                  ? announcement.title_zh
                  : announcement.title_ja}
              </h3>
              <p className="text-sm whitespace-pre-line">
                {language === 'zh' && announcement.content_zh
                  ? announcement.content_zh
                  : announcement.content_ja}
              </p>
            </div>
            <button
              onClick={() => handleDismiss(announcement.id)}
              className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
              aria-label="閉じる"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
