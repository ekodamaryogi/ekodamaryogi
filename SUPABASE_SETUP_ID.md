# Panduan Setup Supabase untuk Website Portofolio

Dokumen ini berisi panduan langkah demi langkah untuk menghubungkan website portofolio ini dengan backend Supabase Anda sendiri.

## 1. Buat Proyek Supabase
1. Kunjungi [supabase.com](https://supabase.com) dan login/daftar.
2. Klik tombol **"New Project"** dan buat proyek baru (pilih nama dan password database).
3. Tunggu beberapa menit hingga database Anda selesai disiapkan.

## 2. Dapatkan Kredensial API (URL dan Anon Key)
1. Di dashboard proyek Supabase Anda, pergi ke menu **Project Settings** (ikon gerigi/settings di sidebar kiri).
2. Pilih tab **API**.
3. Di bawah bagian **Project URL**, salin URL yang ada.
4. Di bawah bagian **Project API Keys**, salin kunci `anon` `public`.

## 3. Konfigurasi Variabel Lingkungan di Website (Environment Variables)
1. Di folder utama (root) kode website ini, buat sebuah file baru bernama `.env.local`
2. Tambahkan URL dan Anon Key yang sudah Anda salin dengan format berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_url_supabase_anda_di_sini
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_anon_key_supabase_anda_di_sini
```

*(Catatan: Jangan gunakan tanda kutip, langsung paste saja setelah tanda sama dengan)*

## 4. Setup Database dan Aturan Keamanan (RLS)
1. Kembali ke dashboard Supabase, klik menu **SQL Editor** di sidebar kiri.
2. Klik tombol **"New Query"**.
3. Buka file `supabase_schema.sql` yang ada di dalam folder kode website ini.
4. Salin **seluruh isi** file `supabase_schema.sql` tersebut, lalu tempelkan (paste) ke dalam SQL Editor di Supabase.
5. Klik tombol **"Run"** di kanan bawah.
   *(Langkah ini akan secara otomatis membuat tabel-tabel yang dibutuhkan, mengatur aturan keamanan, dan membuat bucket penyimpanan gambar)*.

## 5. Buat Akun Admin (Untuk Login di Web)
Karena website portofolio ini menggunakan Supabase Auth untuk menjaga keamanan data, Anda perlu membuat akun admin agar bisa login dan mengedit isi portofolio.

1. Di dashboard Supabase, klik menu **Authentication**.
2. Pilih tab **Users** lalu klik **"Add User"** -> **"Create new user"**.
3. Masukkan email: `admin@example.com` (Penting: Email ini harus sama dengan yang terprogram di dalam web. Anda dapat mengubahnya nanti di file `src/context/AuthContext.tsx`).
4. Masukkan password yang kuat dan mudah Anda ingat (misal: `passwordAdmin123`).
5. Jangan centang "Auto Confirm User" jika Anda tidak menggunakan sistem verifikasi email (opsional, disarankan *centang* saja untuk memudahkan).
6. Klik **Create user**.

*(Jika Anda ingin menggunakan email lain, buka file `src/context/AuthContext.tsx` di kode Anda, cari bagian `email: 'admin@example.com'`, dan ubah dengan email Anda. Ingat untuk mengubahnya **sebelum** deploy ke produksi)*.

## 6. Selesai!
Sekarang Anda bisa menjalankan website di komputer Anda dengan perintah:
```bash
npm run dev
```

Buka `http://localhost:3000/login` dan masuk menggunakan email `admin@example.com` (atau yang sudah Anda ubah) beserta password yang Anda buat di langkah 5. Anda sekarang memiliki hak akses admin untuk menambah, mengubah, dan menghapus data portofolio!
