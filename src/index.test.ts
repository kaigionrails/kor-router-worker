import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import { unstable_dev, type Unstable_DevWorker } from 'wrangler';

describe('worker', () => {
	let worker: Unstable_DevWorker;
	beforeAll(async () => {
		worker = await unstable_dev('./src/index.ts', { logLevel: 'info', experimental: { disableExperimentalWarning: true } });
	});
	afterAll(async () => {
		await worker.stop();
	});

	test('GET /', async () => {
		const response = await worker.fetch('/', { redirect: 'manual' });
		expect(response.status).toBe(302);
		expect(await response.text()).toContain(`<meta http-equiv="refresh" content="0;URL=/2025/">`);
		expect(response.headers.get('location')).toBe('https://kaigionrails.org/2025/');
	});

	describe('2025 (current event)', () => {
		test('GET /2025', async () => {
			const response = await worker.fetch('/2025');
			expect(await response.text()).toContain('Kaigi on Rails 2025');
			expect(response.redirected).toBe(true);
		});

		test('GET /2025/', async () => {
			const response = await worker.fetch('/2025/');
			expect(await response.text()).toContain('Kaigi on Rails 2025');
			expect(response.redirected).toBe(false);
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

	describe('well-known', () => {
		test("GET /.well-known/atproto-did", async () => {
			const response = await worker.fetch('/.well-known/atproto-did');
			expect(response.status).toBe(200);
			expect(await response.text()).toContain('did:plc:');
			expect(response.headers.get('content-type')).toBe('text/plain;charset=UTF-8');
		})
		test("GET /.well-known/unknown", async () => {
			const response = await worker.fetch('/.well-known/unknown');
			expect(response.status).toBe(404);
			expect(await response.text()).toContain('Not Found');
			expect(response.headers.get('content-type')).toBe('text/plain;charset=UTF-8');
		})
	})
});
