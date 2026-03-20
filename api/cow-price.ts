import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ưu tiên biến môi trường COW_PRICE_URL (không có tiền tố VITE_ để an toàn hơn ở phía server)
  const targetUrl = process.env.COW_PRICE_URL || process.env.VITE_COW_PRICE_API || 'https://coinofworld.com/api/price?time=30d&pair=COW%2FUSD';

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
        return res.status(response.status).json({ 
            error: `Cầu nối API thất bại với mã lỗi ${response.status}`,
            url: targetUrl 
        });
    }

    const data = await response.json();
    
    // Cài đặt header để trình duyệt cho phép nhận dữ liệu (thực tế cùng domain không cần nhưng để chắc chắn)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('[API Proxy Error]:', error);
    return res.status(500).json({ 
        error: 'Lỗi khi kết nối tới máy chủ giá COW',
        details: error instanceof Error ? error.message : String(error)
    });
  }
}
