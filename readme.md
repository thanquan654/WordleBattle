# TTNT Wordle Battle

Một dự án Wordle Battle nhiều người chơi, gồm hai phần: **backend** (Node.js/Express/MongoDB) và **frontend** (React/TypeScript/Vite).

---

## Yêu cầu hệ thống

-   **Node.js** >= 18.x
-   **npm** >= 9.x
-   **MongoDB** (chạy local hoặc cloud)

---

## Cài đặt

### 1. Clone dự án

```bash
git clone https://github.com/thanquan654/TTNT_WordleBattle.git
cd TTNT_WordleBattle
```

### 2. Cài đặt backend

```bash
cd ./backend
npm install
```

### 3. Cài đặt frontend

```bash
cd ./frontend
npm install
```

---

## Thiết lập biến môi trường

### Backend

Tạo file `.env` trong thư mục `backend` với các biến sau:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/wordle-battle
```

-   Thay đổi `MONGODB_URI` nếu bạn dùng Mongo Atlas hoặc cổng khác.

### Frontend

File `.env` trong thư mục `frontend`:

```env
VITE_BACKEND_URL=http://localhost:3001
```

-   Nếu backend chạy ở địa chỉ khác, hãy cập nhật lại biến này.

---

## Chạy dự án

### 1. Khởi động backend

```bash
cd ./backend
npm run dev
```

### 2. Khởi động frontend

```bash
cd ./frontend
npm run dev
```

-   Truy cập frontend tại: [http://localhost:5173](http://localhost:5173) (hoặc cổng Vite hiển thị).

---

## Các thông số cấu hình

-   **Thời gian mỗi vòng:** Cấu hình trong giao diện tạo phòng hoặc trong code backend.
-   **Số vòng chơi:** Cấu hình khi tạo phòng.
-   **Danh sách từ:** `backend/wordsList.txt` (có thể thay đổi hoặc mở rộng).
-   **Bot trợ giúp:** Bật/tắt khi tạo phòng.

---

## Ghi chú

-   Đảm bảo MongoDB đã chạy trước khi khởi động backend.
-   Nếu thay đổi port hoặc địa chỉ backend, hãy cập nhật biến môi trường tương ứng ở cả frontend và backend.
-   Để thêm từ mới, chỉnh sửa file `backend/wordsList.txt`.

---

## Thư mục chính

-   `backend/`: API, socket, xử lý game, danh sách từ
-   `frontend/`: Giao diện người dùng, kết nối socket, logic client
