export default async function handler(req, res,) {
    const { mapId } = req.query;
    const { method } = req;

    const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
    const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!mapId || typeof mapId !== 'string') {
        return res.status(400).json({ error: 'Invalid map ID' });
    }

    try {
        if (method === 'GET') {
            const response = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${mapId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`
                }
            });

            if (!response.ok) {
                return res.status(404).json({ error: 'Map not found' });
            }

            const data = await response.json();
            return res.status(200).json(JSON.parse(data.result || '[]'));

        } else if (method === 'POST') {
            const markers = req.body;

            const response = await fetch(`${UPSTASH_REDIS_REST_URL}/set/${mapId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(markers)
            });

            if (!response.ok) {
                return res.status(500).json({ error: 'Failed to save map' });
            }

            return res.status(200).json({ success: true });

        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}