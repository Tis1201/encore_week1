import { api } from 'encore.dev/api';
import applicationContext from '../applicationContext';


// Simple fix - just return object
export const getMetric = api(
  { expose: true, method: 'GET', path: '/metrics' },
  async () => {
    const { metricService } = await applicationContext;
    const metricString = await metricService.getRegistry().metrics();

    // Return object with the metrics data
    return {
      data: metricString,
      contentType: 'text/plain; version=0.0.4; charset=utf-8',
      timestamp: new Date().toISOString()
    };
  },
);