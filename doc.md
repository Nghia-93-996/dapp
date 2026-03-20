# Smart Contract COW

## 1. Giai đoạn Mint (Tạo Token)

**User gửi:** Tài sản thế chấp (ví dụ: USDT, ETH) vào Smart Contract của dự án.

Sử dụng hình thức **THẾ CHẤP DÀNH CHO CRYPTO** giống DAI định giá 70-80% tài sản COW và thanh lý tự động khi giá trị tài sản bị trượt giá quá mức cho phép.

**Smart Contract thực hiện:**
- Kiểm tra số lượng tài sản nhận được + phí SPREAD + phí MINT
  - Tự động gọi hàm `mint()` để tạo ra token mới tương ứng.
  - Gửi token mới về ví User.

**Kết quả:** Tài sản thế chấp nằm an toàn trong hợp đồng, thanh khoản hệ thống tăng lên.

---

## 2. Giai đoạn Burn (Rút tài sản)

**User gửi:** Token của dự án lại vào Smart Contract và gọi lệnh burn.

**Smart Contract thực hiện:**
- Hủy (burn) số token đó khỏi tổng cung + gas + phí BURN
- Tự động giải phóng (release) một lượng tài sản thế chấp tương ứng từ Kho bạc.
- Gửi tài sản thế chấp lại cho User.

---

## 3. Sử dụng địa chỉ Smart Contract làm Kho Bạc

- Kho bạc tự động phình to lên khi user mint token và thế chấp tài sản.
- **Không có hàm rút tiền (withdraw) và in token dành cho Admin.**
- Chỉ có hàm rút tiền dành cho User khi họ burn token.
- Hàm quản lý, cập nhật giá tài sản theo thời gian thực.
- Hàm tính toán tỷ lệ thế chấp hiện tại của một User. Nếu tỷ lệ này rơi xuống dưới ngưỡng (ví dụ 105%), tài sản sẽ bị thanh lý.
- Hàm thanh lý tài sản thế chấp tự động.

---

## Nâng cấp Smart Contract

- Gửi lệnh nâng cấp smart contract lên hệ thống chờ.
- Hệ thống sẽ treo lệnh đó trong vòng **48h - 72h**.
- Hủy lệnh nếu phát hiện lỗ hổng hoặc sai sót.
- User có thể vào soi code + smart contract mới, họ có đủ thời gian để Burn token và rút tài sản thế chấp ra trước khi code mới có hiệu lực (khi thấy có dấu hiệu rug pull).
- **CÔNG KHAI SOURCE CODE + SMART CONTRACT.**

---

## Lưu ý

| Hạng mục | Chi tiết |
|---|---|
| **Kho bạc chính 1** | Sử dụng địa chỉ CONTRACT để lưu giữ tài sản. Loại bỏ quyền admin để tránh rug pull, scam. |
| **Spread** | Giá Mint COW chênh lệch **1%** với Burn COW. Spread = Giá Ask - Giá Bid. |
| **Kho bạc 2** | Spread được chuyển sang kho bạc 2 do admin COW quản lý. |
| **Mục đích Spread** | 1% Spread dùng cho Dự Trữ, Xây dựng, phát triển công nghệ cho COW. |
| **Phí Mint** | 0.3% / 1 COW + gas fee (user chịu) — lợi nhuận chuyển vào ví ADMIN + DEV để duy trì đội ngũ và dự án. |
| **Phí Burn** | 0.3% / 1 COW + gas fee (user chịu). |

> **Phí mint/burn được thu 1 lần khi user MINT. Lợi nhuận sẽ được chuyển vào địa chỉ ví của ADMIN + DEV của COW để duy trì đội ngũ và dự án.**

---

## Thực hiện

- Triển khai DApp + Smart Contract (mục kết nối ví có thể mở rộng thêm thư viện nhiều loại ví hơn).
- Tích hợp trên web chính ở mục **CONNECT WALLET** (mở thêm chức năng Connect Wallet và đưa chức năng **KHAI THÁC COWe** xuống dưới).

---

## Chiến lược mở rộng

- Cần có **1 Smart Contract gốc chuẩn** để triển khai COW.
- Dùng bản gốc để **nhân bản và triển khai mở rộng** trên các blockchain khác như **SUI, Solana, Base…** (cần báo giá thêm và đề xuất phương án lâu dài).
- **Listing DEX:** Hiện tại chưa có giải pháp cho thanh khoản, tạm thời ngưng để bàn bạc, tìm hướng và cần cố vấn từ Fiotech. **Tập trung vào CONTRACT và MỞ RỘNG CHAIN trước.**
