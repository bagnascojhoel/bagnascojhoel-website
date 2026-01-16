import { getRequestConfig } from 'next-intl/server';
import { container } from '@/core/ContainerConfig';
import {
  LocalizationApplicationService,
  LocalizationApplicationServiceToken,
} from '@/core/application-services/LocalizationApplicationService';

export default getRequestConfig(async params => {
  const locale = (await params.requestLocale)!;
  const messages = await container
    .get<LocalizationApplicationService>(LocalizationApplicationServiceToken)
    .getLocalizedMessages(locale);
  return { locale, messages };
});
