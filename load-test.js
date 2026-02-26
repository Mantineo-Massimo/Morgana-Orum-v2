import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp-up to 20 users
        { duration: '1m', target: 50 },  // Stay at 50 users for 1 minute
        { duration: '30s', target: 100 }, // Peak at 100 users
        { duration: '30s', target: 0 },   // Ramp-down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
        http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
    },
};

const BASE_URL = 'https://morganaorum.vercel.app';

export default function () {
    const responses = http.batch([
        ['GET', `${BASE_URL}/it`],
        ['GET', `${BASE_URL}/en`],
        ['GET', `${BASE_URL}/it/news`],
        ['GET', `${BASE_URL}/it/events`],
        ['GET', `${BASE_URL}/it/representatives`],
        ['GET', `${BASE_URL}/it/network/economia`],
    ]);

    responses.forEach((res) => {
        check(res, {
            'status is 200': (r) => r.status === 200,
        });
    });

    sleep(Math.random() * 3 + 1); // Random sleep between 1-4 seconds to simulate human behavior
}
