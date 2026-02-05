-- ============================================
-- MAPIC APP - SEED DATA
-- Tạo dữ liệu demo cho testing
-- ============================================

-- Clear existing data (optional, comment out if you want to keep existing data)
-- DELETE FROM locations;
-- DELETE FROM friendships;
-- DELETE FROM places;
-- DELETE FROM users WHERE id > 1;

-- ============================================
-- USERS (10 users với avatars đẹp)
-- ============================================
-- Password cho tất cả: 091005aE@
-- Hashed: $2a$10$rQJ5Z8QZ8Z8Z8Z8Z8Z8Z8uK (example, cần hash thật)

INSERT INTO users (email, password, full_name, phone, avatar_url, is_active, created_at, updated_at) VALUES
('user2@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn An', '0912345679', 'https://ui-avatars.com/api/?name=Nguyen+Van+An&size=200&background=4285F4&color=fff&bold=true', true, NOW(), NOW()),
('user3@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trần Thị Bình', '0912345680', 'https://ui-avatars.com/api/?name=Tran+Thi+Binh&size=200&background=34A853&color=fff&bold=true', true, NOW(), NOW()),
('user4@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lê Minh Cường', '0912345681', 'https://ui-avatars.com/api/?name=Le+Minh+Cuong&size=200&background=FBBC04&color=fff&bold=true', true, NOW(), NOW()),
('user5@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Phạm Thu Dung', '0912345682', 'https://ui-avatars.com/api/?name=Pham+Thu+Dung&size=200&background=EA4335&color=fff&bold=true', true, NOW(), NOW()),
('user6@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Hoàng Văn Em', '0912345683', 'https://ui-avatars.com/api/?name=Hoang+Van+Em&size=200&background=9C27B0&color=fff&bold=true', true, NOW(), NOW()),
('user7@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Đỗ Thị Phương', '0912345684', 'https://ui-avatars.com/api/?name=Do+Thi+Phuong&size=200&background=FF5722&color=fff&bold=true', true, NOW(), NOW()),
('user8@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vũ Minh Giang', '0912345685', 'https://ui-avatars.com/api/?name=Vu+Minh+Giang&size=200&background=00BCD4&color=fff&bold=true', true, NOW(), NOW()),
('user9@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bùi Thu Hà', '0912345686', 'https://ui-avatars.com/api/?name=Bui+Thu+Ha&size=200&background=8BC34A&color=fff&bold=true', true, NOW(), NOW()),
('user10@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ngô Văn Ích', '0912345687', 'https://ui-avatars.com/api/?name=Ngo+Van+Ich&size=200&background=FF9800&color=fff&bold=true', true, NOW(), NOW()),
('user11@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Đinh Thị Kim', '0912345688', 'https://ui-avatars.com/api/?name=Dinh+Thi+Kim&size=200&background=E91E63&color=fff&bold=true', true, NOW(), NOW());

-- ============================================
-- FRIENDSHIPS (User 1 có 5 friends)
-- ============================================
INSERT INTO friendships (user_id, friend_id, status, created_at, updated_at) VALUES
-- User 1's friends (ACCEPTED)
(1, 2, 'ACCEPTED', NOW() - INTERVAL '10 days', NOW()),
(1, 3, 'ACCEPTED', NOW() - INTERVAL '8 days', NOW()),
(1, 4, 'ACCEPTED', NOW() - INTERVAL '5 days', NOW()),
(1, 5, 'ACCEPTED', NOW() - INTERVAL '3 days', NOW()),
(1, 6, 'ACCEPTED', NOW() - INTERVAL '1 day', NOW()),

-- Pending requests
(1, 7, 'PENDING', NOW() - INTERVAL '2 hours', NOW()),
(8, 1, 'PENDING', NOW() - INTERVAL '1 hour', NOW()),

-- Other users' friendships
(2, 3, 'ACCEPTED', NOW() - INTERVAL '15 days', NOW()),
(2, 4, 'ACCEPTED', NOW() - INTERVAL '12 days', NOW()),
(3, 5, 'ACCEPTED', NOW() - INTERVAL '7 days', NOW()),
(4, 6, 'ACCEPTED', NOW() - INTERVAL '4 days', NOW()),
(5, 7, 'ACCEPTED', NOW() - INTERVAL '2 days', NOW()),
(6, 8, 'ACCEPTED', NOW() - INTERVAL '1 day', NOW()),
(7, 9, 'ACCEPTED', NOW() - INTERVAL '6 hours', NOW()),
(8, 10, 'ACCEPTED', NOW() - INTERVAL '3 hours', NOW());

-- ============================================
-- LOCATIONS (Khu vực TP.HCM)
-- ============================================
-- User 2: Quận 1 (gần Nhà Thờ Đức Bà)
INSERT INTO locations (user_id, latitude, longitude, accuracy, speed, heading, status, timestamp, created_at) VALUES
(2, 10.7797, 106.6991, 10.0, 0.0, 0.0, 'ACTIVE', NOW() - INTERVAL '2 minutes', NOW()),
(2, 10.7795, 106.6989, 10.0, 5.0, 90.0, 'MOVING', NOW() - INTERVAL '5 minutes', NOW()),
(2, 10.7793, 106.6987, 10.0, 8.0, 90.0, 'MOVING', NOW() - INTERVAL '10 minutes', NOW());

-- User 3: Quận 3 (gần Công viên Tao Đàn)
INSERT INTO locations (user_id, latitude, longitude, accuracy, speed, heading, status, timestamp, created_at) VALUES
(3, 10.7825, 106.6920, 10.0, 0.0, 0.0, 'ACTIVE', NOW() - INTERVAL '1 minute', NOW()),
(3, 10.7823, 106.6918, 10.0, 3.0, 180.0, 'MOVING', NOW() - INTERVAL '8 minutes', NOW()),
(3, 10.7821, 106.6916, 10.0, 4.0, 180.0, 'MOVING', NOW() - INTERVAL '15 minutes', NOW());

-- User 4: Quận 5 (gần Chợ Lớn)
INSERT INTO locations (user_id, latitude, longitude, accuracy, speed, heading, status, timestamp, created_at) VALUES
(4, 10.7550, 106.6650, 10.0, 0.0, 0.0, 'IDLE', NOW() - INTERVAL '30 minutes', NOW()),
(4, 10.7548, 106.6648, 10.0, 2.0, 270.0, 'MOVING', NOW() - INTERVAL '45 minutes', NOW()),
(4, 10.7546, 106.6646, 10.0, 3.0, 270.0, 'MOVING', NOW() - INTERVAL '1 hour', NOW());

-- User 5: Quận 7 (gần Phú Mỹ Hưng)
INSERT INTO locations (user_id, latitude, longitude, accuracy, speed, heading, status, timestamp, created_at) VALUES
(5, 10.7300, 106.7200, 10.0, 0.0, 0.0, 'ACTIVE', NOW() - INTERVAL '5 minutes', NOW()),
(5, 10.7298, 106.7198, 10.0, 10.0, 45.0, 'MOVING', NOW() - INTERVAL '12 minutes', NOW()),
(5, 10.7296, 106.7196, 10.0, 12.0, 45.0, 'MOVING', NOW() - INTERVAL '20 minutes', NOW());

-- User 6: Quận 10 (gần Chợ Bà Chiểu)
INSERT INTO locations (user_id, latitude, longitude, accuracy, speed, heading, status, timestamp, created_at) VALUES
(6, 10.7700, 106.6700, 10.0, 0.0, 0.0, 'ACTIVE', NOW() - INTERVAL '3 minutes', NOW()),
(6, 10.7698, 106.6698, 10.0, 6.0, 135.0, 'MOVING', NOW() - INTERVAL '10 minutes', NOW()),
(6, 10.7696, 106.6696, 10.0, 7.0, 135.0, 'MOVING', NOW() - INTERVAL '18 minutes', NOW());

-- User 7: Bình Thạnh (gần Landmark 81)
INSERT INTO locations (user_id, latitude, longitude, accuracy, speed, heading, status, timestamp, created_at) VALUES
(7, 10.7950, 106.7220, 10.0, 0.0, 0.0, 'IDLE', NOW() - INTERVAL '2 hours', NOW()),
(7, 10.7948, 106.7218, 10.0, 4.0, 225.0, 'MOVING', NOW() - INTERVAL '3 hours', NOW());

-- User 8: Quận 2 (gần Thảo Điền)
INSERT INTO locations (user_id, latitude, longitude, accuracy, speed, heading, status, timestamp, created_at) VALUES
(8, 10.8050, 106.7400, 10.0, 0.0, 0.0, 'ACTIVE', NOW() - INTERVAL '10 minutes', NOW()),
(8, 10.8048, 106.7398, 10.0, 5.0, 315.0, 'MOVING', NOW() - INTERVAL '25 minutes', NOW());

-- User 9: Tân Bình (gần sân bay)
INSERT INTO locations (user_id, latitude, longitude, accuracy, speed, heading, status, timestamp, created_at) VALUES
(9, 10.8184, 106.6595, 10.0, 0.0, 0.0, 'ACTIVE', NOW() - INTERVAL '15 minutes', NOW()),
(9, 10.8182, 106.6593, 10.0, 8.0, 180.0, 'MOVING', NOW() - INTERVAL '30 minutes', NOW());

-- User 10: Gò Vấp
INSERT INTO locations (user_id, latitude, longitude, accuracy, speed, heading, status, timestamp, created_at) VALUES
(10, 10.8400, 106.6800, 10.0, 0.0, 0.0, 'IDLE', NOW() - INTERVAL '1 hour', NOW()),
(10, 10.8398, 106.6798, 10.0, 3.0, 90.0, 'MOVING', NOW() - INTERVAL '2 hours', NOW());

-- User 11: Phú Nhuận
INSERT INTO locations (user_id, latitude, longitude, accuracy, speed, heading, status, timestamp, created_at) VALUES
(11, 10.7980, 106.6830, 10.0, 0.0, 0.0, 'ACTIVE', NOW() - INTERVAL '20 minutes', NOW()),
(11, 10.7978, 106.6828, 10.0, 4.0, 270.0, 'MOVING', NOW() - INTERVAL '40 minutes', NOW());

-- ============================================
-- PLACES (30 địa điểm ở TP.HCM)
-- ============================================

-- CAFES (10)
INSERT INTO places (name, description, category, latitude, longitude, address, rating, created_by_id, created_at, updated_at) VALUES
('The Coffee House', 'Chuỗi cà phê nổi tiếng với không gian hiện đại', 'CAFE', 10.7769, 106.7009, '86-88 Cao Thắng, Quận 3', 4.5, 1, NOW(), NOW()),
('Highlands Coffee', 'Cà phê Việt Nam với nhiều chi nhánh', 'CAFE', 10.7797, 106.6991, '2 Công xã Paris, Quận 1', 4.3, 1, NOW(), NOW()),
('Starbucks Reserve', 'Starbucks cao cấp với không gian sang trọng', 'CAFE', 10.7825, 106.6920, '72-74 Nguyễn Thị Minh Khai, Quận 3', 4.7, 2, NOW(), NOW()),
('Trung Nguyên Legend', 'Cà phê Việt truyền thống', 'CAFE', 10.7700, 106.6700, '123 Lê Hồng Phong, Quận 10', 4.4, 2, NOW(), NOW()),
('Phúc Long Coffee & Tea', 'Cà phê và trà sữa ngon', 'CAFE', 10.7950, 106.7220, 'Vinhomes Central Park, Bình Thạnh', 4.6, 3, NOW(), NOW()),
('Cộng Cà Phê', 'Phong cách cổ điển Việt Nam', 'CAFE', 10.7550, 106.6650, '26 Lý Tự Trọng, Quận 1', 4.5, 3, NOW(), NOW()),
('Urban Station', 'Không gian làm việc và cà phê', 'CAFE', 10.8050, 106.7400, '72 Thảo Điền, Quận 2', 4.4, 4, NOW(), NOW()),
('L''Usine', 'Cà phê phong cách Pháp', 'CAFE', 10.7797, 106.7020, '151 Đồng Khởi, Quận 1', 4.8, 4, NOW(), NOW()),
('The Workshop', 'Specialty coffee', 'CAFE', 10.7825, 106.6950, '27 Ngô Đức Kế, Quận 1', 4.7, 5, NOW(), NOW()),
('Saigon Ơi', 'Cà phê sân vườn yên tĩnh', 'CAFE', 10.7980, 106.6830, '176 Bùi Thị Xuân, Phú Nhuận', 4.6, 5, NOW(), NOW());

-- RESTAURANTS (10)
INSERT INTO places (name, description, category, latitude, longitude, address, rating, created_by_id, created_at, updated_at) VALUES
('Phở 24', 'Phở Hà Nội chính gốc', 'RESTAURANT', 10.7625, 106.6820, '5 Nguyễn Trường Tộ, Quận 4', 4.8, 1, NOW(), NOW()),
('Quán Ăn Ngon', 'Món ăn Việt Nam đa dạng', 'RESTAURANT', 10.7769, 106.7000, '138 Nam Kỳ Khởi Nghĩa, Quận 1', 4.7, 1, NOW(), NOW()),
('Bún Chả Hà Nội', 'Bún chả ngon như ở Hà Nội', 'RESTAURANT', 10.7700, 106.6720, '34 Lý Thường Kiệt, Quận 10', 4.6, 2, NOW(), NOW()),
('Cơm Tấm Sườn Nướng', 'Cơm tấm Sài Gòn truyền thống', 'RESTAURANT', 10.7550, 106.6670, '89 Trần Hưng Đạo, Quận 5', 4.5, 2, NOW(), NOW()),
('Lẩu Thái Lan', 'Lẩu Thái cay nồng', 'RESTAURANT', 10.7300, 106.7200, 'Phú Mỹ Hưng, Quận 7', 4.4, 3, NOW(), NOW()),
('Nhà Hàng Hải Sản', 'Hải sản tươi sống', 'RESTAURANT', 10.8050, 106.7420, '45 Xuân Thủy, Quận 2', 4.7, 3, NOW(), NOW()),
('Bánh Xèo 46A', 'Bánh xèo miền Tây', 'RESTAURANT', 10.7797, 106.6980, '46A Đinh Công Tráng, Quận 1', 4.8, 4, NOW(), NOW()),
('Bò Tơ Quán Mộc', 'Bò tơ tây ninh ngon', 'RESTAURANT', 10.7950, 106.7200, 'Landmark 81, Bình Thạnh', 4.6, 4, NOW(), NOW()),
('Gà Rán KFC', 'Gà rán nổi tiếng', 'RESTAURANT', 10.8184, 106.6595, 'Sân bay Tân Sơn Nhất', 4.3, 5, NOW(), NOW()),
('Pizza 4P''s', 'Pizza Nhật Bản', 'RESTAURANT', 10.7825, 106.6930, '8 Thủ Khoa Huân, Quận 1', 4.9, 5, NOW(), NOW());

-- PARKS (5)
INSERT INTO places (name, description, category, latitude, longitude, address, rating, created_by_id, created_at, updated_at) VALUES
('Công viên Tao Đàn', 'Công viên lớn giữa lòng thành phố', 'PARK', 10.7825, 106.6920, 'Trương Định, Quận 3', 4.5, 1, NOW(), NOW()),
('Công viên 23/9', 'Công viên ven sông Sài Gòn', 'PARK', 10.7700, 106.7050, 'Phạm Ngũ Lão, Quận 1', 4.4, 2, NOW(), NOW()),
('Công viên Gia Định', 'Công viên rộng rãi', 'PARK', 10.8100, 106.6800, 'Hoàng Minh Giám, Phú Nhuận', 4.6, 3, NOW(), NOW()),
('Công viên Lê Văn Tám', 'Công viên yên tĩnh', 'PARK', 10.7850, 106.6850, 'Võ Thị Sáu, Quận 3', 4.3, 4, NOW(), NOW()),
('Công viên Hoàng Văn Thụ', 'Công viên nhỏ xinh', 'PARK', 10.8000, 106.6750, 'Hoàng Văn Thụ, Tân Bình', 4.2, 5, NOW(), NOW());

-- MUSEUMS (3)
INSERT INTO places (name, description, category, latitude, longitude, address, rating, created_by_id, created_at, updated_at) VALUES
('Bảo tàng Chứng tích Chiến tranh', 'Bảo tàng lịch sử chiến tranh', 'MUSEUM', 10.7797, 106.6920, '28 Võ Văn Tần, Quận 3', 4.7, 1, NOW(), NOW()),
('Bảo tàng Thành phố', 'Bảo tàng lịch sử Sài Gòn', 'MUSEUM', 10.7769, 106.7000, '65 Lý Tự Trọng, Quận 1', 4.5, 2, NOW(), NOW()),
('Bảo tàng Mỹ thuật', 'Bảo tàng nghệ thuật', 'MUSEUM', 10.7700, 106.6950, '97A Phó Đức Chính, Quận 1', 4.4, 3, NOW(), NOW());

-- SHOPPING (2)
INSERT INTO places (name, description, category, latitude, longitude, address, rating, created_by_id, created_at, updated_at) VALUES
('Vincom Center', 'Trung tâm thương mại lớn', 'SHOPPING', 10.7797, 106.7000, '72 Lê Thánh Tôn, Quận 1', 4.6, 1, NOW(), NOW()),
('Saigon Centre', 'Trung tâm mua sắm cao cấp', 'SHOPPING', 10.7825, 106.7020, '65 Lê Lợi, Quận 1', 4.5, 2, NOW(), NOW());

-- ============================================
-- VERIFICATION
-- ============================================
-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_friendships FROM friendships;
-- SELECT COUNT(*) as total_locations FROM locations;
-- SELECT COUNT(*) as total_places FROM places;
