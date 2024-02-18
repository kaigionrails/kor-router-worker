import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import { UnstableDevWorker, unstable_dev } from 'wrangler';

describe('worker', () => {
	let worker: UnstableDevWorker;
	beforeAll(async () => {
		worker = await unstable_dev('./src/index.ts', { logLevel: 'info', experimental: { disableExperimentalWarning: true } });
	});
	afterAll(async () => {
		await worker.stop();
	});

	test('GET /', async () => {
		const response = await worker.fetch('/', { redirect: 'manual' });
		expect(response.status).toBe(302);
		expect(response.headers.get('Location')).toBe('https://kaigionrails.org/2024/');
	});

	describe('2024 (current event)', () => {
		test('GET /2024', async () => {
			const response = await worker.fetch('/2024');
			expect(await response.text()).toContain('Kaigi on Rails 2024');
			expect(response.redirected).toBe(true);
		});

		test('GET /2024/', async () => {
			const response = await worker.fetch('/2024/');
			expect(await response.text()).toContain('Kaigi on Rails 2024');
			expect(response.redirected).toBe(true);
		});

		test('GET /2024/index.html', async () => {
			const response = await worker.fetch('/2024/index.html');
			expect(await response.text()).toContain('Kaigi on Rails 2024');
			expect(response.url).toBe('https://kaigionrails.org/2024/index.html');
			expect(response.redirected).toBe(true);
		});
	});

	describe('past events', () => {
		test('GET /2023', async () => {
			const response = await worker.fetch('/2023');
			expect(await response.text()).toContain('Kaigi on Rails 2023');
			expect(response.redirected).toBe(true);
		});
		test('GET /2023/', async () => {
			const response = await worker.fetch('/2023/');
			expect(await response.text()).toContain('Kaigi on Rails 2023');
			expect(response.redirected).toBe(false);
		});
		test('GET /2023/cfp', async () => {
			const response = await worker.fetch('/2023/cfp');
			expect(response.redirected).toBe(true);
		});
		test('GET /2023/cfp/', async () => {
			const response = await worker.fetch('/2023/cfp/');
			expect(await response.text()).toContain('プロポーザルを選定する際の大まかな要素を提示いたします');
			expect(response.redirected).toBe(false);
		});
		test('GET /2023/images/favicon.ico', async () => {
			const response = await worker.fetch('/2023/images/favicon.ico');
			expect(response.headers.get('content-type')).toBe('image/vnd.microsoft.icon');
			expect(response.redirected).toBe(false);
		});

		test('GET /2022', async () => {
			const response = await worker.fetch('/2022');
			expect(await response.text()).toContain('Kaigi on Rails 2022');
			expect(response.redirected).toBe(true);
		});
		test('GET /2022/', async () => {
			const response = await worker.fetch('/2022/');
			expect(await response.text()).toContain('Kaigi on Rails 2022');
			expect(response.redirected).toBe(false);
		});
		test('GET /2022/team/', async () => {
			const response = await worker.fetch('/2023/team/');
			expect(response.redirected).toBe(false);
		});
	});
});
