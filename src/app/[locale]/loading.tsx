import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('Common');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div
          role="status"
          aria-label={t('loading')}
          className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"
        />
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      </div>
    </div>
  );
}
