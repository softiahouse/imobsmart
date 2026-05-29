/**
 * Tests for /api/contact route
 * Tests n8n webhook forwarding behaviour
 */
import { POST } from '@/app/[locale]/api/contact/route';
import { NextRequest } from 'next/server';

// Mock fetch globally
global.fetch = jest.fn();

const makeReq = (body: object) =>
  new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.N8N_WEBHOOK_URL = 'https://test.webhook.com/nk';
  });

  it('returns 200 and forwards payload to n8n when webhook succeeds', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const res = await POST(makeReq({ name: 'Ana', phone: '600111222', service: 'Botox', message: 'Hello', lang: 'es' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test.webhook.com/nk',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"name":"Ana"'),
      })
    );
  });

  it('returns 400 when name or phone is missing', async () => {
    const res = await POST(makeReq({ phone: '600111222' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('name and phone are required');
  });

  it('returns 500 when n8n webhook fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });
    const res = await POST(makeReq({ name: 'Ana', phone: '600111222', lang: 'es' }));
    expect(res.status).toBe(500);
  });

  it('returns 500 when N8N_WEBHOOK_URL is not set', async () => {
    delete process.env.N8N_WEBHOOK_URL;
    const res = await POST(makeReq({ name: 'Ana', phone: '600111222', lang: 'es' }));
    expect(res.status).toBe(500);
  });
});
