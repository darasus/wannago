import {ApiCheck, AssertionBuilder} from 'checkly/constructs';

new ApiCheck('homepage-api-check-1', {
  name: 'Test API Check',
  alertChannels: [],
  degradedResponseTime: 10000,
  maxResponseTime: 20000,
  request: {
    url: 'https://wannago.app/api/favicon',
    method: 'GET',
    followRedirects: true,
    skipSSL: false,
    assertions: [AssertionBuilder.statusCode().equals(200)],
  },
});
