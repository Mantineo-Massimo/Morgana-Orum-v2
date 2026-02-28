import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Custom trends to track individual pages
const homeTrend = new Trend('page_home');
const newsTrend = new Trend('page_news');
const eventsTrend = new Trend('page_events');
const repsTrend = new Trend('page_reps');
const networkTrend = new Trend('page_network');

export const options = {
    stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 100 },
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], // Relaxed to 1s for Hobby tier peak
        http_req_failed: ['rate<0.1'],
    },
};

const BASE_URL = 'https://morganaorum.vercel.app';

export default function () {
    // 1. Home
    const resHome = http.get(`${BASE_URL}/it`);
    homeTrend.add(resHome.timings.duration);
    check(resHome, { 'home status 200': (r) => r.status === 200 });

    // 2. News
    const resNews = http.get(`${BASE_URL}/it/news`);
    newsTrend.add(resNews.timings.duration);
    check(resNews, { 'news status 200': (r) => r.status === 200 });

    // 3. Events
    const resEvents = http.get(`${BASE_URL}/it/events`);
    eventsTrend.add(resEvents.timings.duration);
    check(resEvents, { 'events status 200': (r) => r.status === 200 });

    // 4. Reps
    const resReps = http.get(`${BASE_URL}/it/representatives`);
    repsTrend.add(resReps.timings.duration);
    check(resReps, { 'reps status 200': (r) => r.status === 200 });

    // 5. Network (Economia)
    const resNet = http.get(`${BASE_URL}/it/network/economia`);
    networkTrend.add(resNet.timings.duration);
    check(resNet, { 'network status 200': (r) => r.status === 200 });

    sleep(Math.random() * 3 + 1);
}
