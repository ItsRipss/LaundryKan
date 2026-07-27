DROP DATABASE IF EXISTS laundrykan;
CREATE DATABASE laundrykan;
USE laundrykan;

-- Tabel Users (Multi-Role: owner, admin, courier, customer)
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role ENUM('owner', 'admin', 'courier', 'customer') NOT NULL DEFAULT 'customer',
                       nama_lengkap VARCHAR(100),
                       no_hp VARCHAR(20),
                       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert pengguna default
-- Password admin: wangi2026
INSERT INTO users (username, password, role, nama_lengkap)
VALUES ('admin', '$2b$10$GWBzvfvqfRozlDt7V20Ud.F3KQJl2cGOtNXpw.cVJI2cIHqMY6nZm', 'admin', 'Administrator');

-- Password owner: laundryterbaikdari2025
INSERT INTO users (username, password, role, nama_lengkap, no_hp)
VALUES ('owner', '$2b$10$xAfLiUITHLwKNh5DakoGmenPftSvL.Uyz13Y66QpXyu7IKBoPgYmG', 'owner', 'Pemilik Usaha', '087714491490');

-- Password kurir: secepatkilat
INSERT INTO users (username, password, role, nama_lengkap)
VALUES ('budi', '$2b$10$0YEClk12.tnz9g7zxgO1K.RqTRmnYbxPwmAc609kGtIxofOJDYZwO', 'courier', 'Budi');

INSERT INTO users (username, password, role, nama_lengkap)
VALUES ('ahmad', '$2b$10$0YEClk12.tnz9g7zxgO1K.RqTRmnYbxPwmAc609kGtIxofOJDYZwO', 'courier', 'Ahmad');

INSERT INTO users (username, password, role, nama_lengkap)
VALUES ('dafa', '$2b$10$0YEClk12.tnz9g7zxgO1K.RqTRmnYbxPwmAc609kGtIxofOJDYZwO', 'courier', 'Dafa');

INSERT INTO users (username, password, role, nama_lengkap)
VALUES ('zaki', '$2b$10$0YEClk12.tnz9g7zxgO1K.RqTRmnYbxPwmAc609kGtIxofOJDYZwO', 'courier', 'Zaki');

INSERT INTO users (username, password, role, nama_lengkap)
VALUES ('rehan', '$2b$10$0YEClk12.tnz9g7zxgO1K.RqTRmnYbxPwmAc609kGtIxofOJDYZwO', 'courier', 'Rehan');

CREATE TABLE orders (
                        code VARCHAR(20) PRIMARY KEY,
                        nama VARCHAR(100) NOT NULL,
                        hp VARCHAR(20) NOT NULL,
                        alamat TEXT NOT NULL,
                        layanan VARCHAR(50) NOT NULL,
                        berat INT NOT NULL,
                        tanggal DATE NOT NULL,
                        jam VARCHAR(20) NOT NULL,
                        catatan TEXT,
                        manualStage INT DEFAULT NULL,
                        courier_id INT DEFAULT NULL,
                        total_harga DECIMAL(10,2) DEFAULT NULL,
                        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                        payment_status ENUM('Belum Lunas', 'Lunas') NOT NULL DEFAULT 'Belum Lunas',
                        FOREIGN KEY (courier_id) REFERENCES users(id) ON DELETE SET NULL,
                        completed_at DATETIME DEFAULT NULL
);

-- Tabel Pesan Kontak
CREATE TABLE messages (
                          id VARCHAR(50) PRIMARY KEY,
                          nama VARCHAR(100) NOT NULL,
                          email VARCHAR(100) NOT NULL,
                          pesan TEXT NOT NULL,
                          is_read BOOLEAN DEFAULT FALSE,
                          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_activity (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                order_code VARCHAR(30) NOT NULL,
                                old_stage INT NULL,
                                new_stage INT NULL,
                                changed_by INT,
                                changed_role VARCHAR(30),
                                activity_type VARCHAR(30) NOT NULL DEFAULT 'status',
                                description TEXT NULL,
                                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT fk_activity_order
                                    FOREIGN KEY (order_code)
                                        REFERENCES orders(code)
                                        ON DELETE CASCADE
);

CREATE TABLE notifications (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               title VARCHAR(200) NOT NULL,
                               message TEXT NOT NULL,
                               type ENUM(
                                   'order',
                                   'status',
                                   'message',
                                   'system'
                                   ) DEFAULT 'system',
                               is_read BOOLEAN DEFAULT FALSE,
                               createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivery_proofs (
                                 id INT AUTO_INCREMENT PRIMARY KEY,
                                 order_code VARCHAR(30) NOT NULL,
                                 photo_path VARCHAR(255) NOT NULL,
                                 uploaded_by INT,
                                 uploaded_role VARCHAR(30),
                                 status ENUM('uploaded','verified')
                                                     DEFAULT 'uploaded',

                                 createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 CONSTRAINT fk_delivery_order
                                     FOREIGN KEY (order_code)
                                         REFERENCES orders(code)
                                         ON DELETE CASCADE
);