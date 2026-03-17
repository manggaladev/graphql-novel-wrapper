import { Context } from '../context';
import { config } from '../../config';

export const healthResolver = {
  Query: {
    health: () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      restApiUrl: config.restApiUrl,
    }),
  },
};
