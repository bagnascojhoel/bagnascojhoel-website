import { getRequestConfig } from 'next-intl/server';
import { container } from '@/core/ContainerConfig';
import {
  MessagesApplicationService,
  MessagesApplicationServiceToken,
} from '@/core/application-services/MessagesApplicationService';

export default getRequestConfig(async params => {
  const locale = (await params.requestLocale)!;
  const messages = await container
    .get<MessagesApplicationService>(MessagesApplicationServiceToken)
    .getLocalizedMessages(locale);
  return { locale, messages };
});
