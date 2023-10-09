# Trasure Hunter

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Deskripsi
Game Treasure Hunter ini adalah multiplayer game berbasis colyseus sebagai server utamanya.  
dan ini adalah repo frontendnya. repo backend disini https://github.com/ikhsanheriyawan2404/treasure-hunter-colyseus. 

## Fitur Utama
- Player bisa saling interaksi dengan player seperti chat, movement di maps, dan berebut treasure
- Interaksi dengan object yang didalam maps seperti item, explosion, dan treasure. Sehingga bisa mempengaruhi status player seperti health, speed, dan points dari treasure untuk memenangkan match
- Baca selengkapnya disini https://github.com/Ikhsanheriyawan2404/client-coly/wiki

## List Harapan & Ide ide kedepan
- Frontend agak bagus dikit lah ya masa masih pake native gini. minimal vue atau apa gtu.
- ✓ Integrasi dengan backend sehingga bisa menerapkan user daftar dan logon untuk play game ini. repo backend sudah ada tinggal dikembangin lagi https://github.com/Ikhsanheriyawan2404/treasure-hunter-express. note: tidak jadi menggunakan backend, backend digabung dengan project colyseus.
- Realisasi Object Bot Enemy dengan pergerakan. menggunakan leaflet-trackplayback.

- Hal yang bisa kita explore disini yaitu:
- Framework ColySeus
- Typescript
- Vue (jika frontend menggunakan Vue)
- Library Leaflet
- 

## Prasyarat
- "colyseus.js": "^0.15.9",
- "leaflet": "^1.9.4",

## Instalasi
### Instalasi Server Colyseus

1. Clone repositori ini ke mesin lokalmu.
```bash
git clone https://github.com/ikhsanheriyawan2404/treasure-hunter-colyseus.git
```

2. Install dependensi.
```bash
npm install
```

3. Konfigurasi .env file untuk database dan jalankan datanya.
```bash
npx prisma db push
```

4. Jalankan servicenya.
```bash
npm run start
```
### Instalasi Frontend
1. Clone repositori ini ke mesin lokalmu.
```bash
git clone https://github.com/ikhsanheriyawan2404/client-coly.git
```

2. Install dependensi.
```bash
npm install
```

3. Buka http://localhost/client-coly-main dibrowser local anda

## Kontribusi
Jika kamu ingin berkontribusi pada proyek ini, silakan ikuti langkah-langkah berikut:
1. Fork repositori ini.
2. Buat branch fitur baru.
```bash
git checkout -b fitur-baru
```
3. Lakukan perubahan dan commit.
```bash
git commit -m 'Tambahkan fitur baru'
```
4. Push ke branch fitur-baru.
```bash
git push origin fitur-baru
```
5. Buat pull request di repositori ini.


## Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Kontak
Jika kamu memiliki pertanyaan atau ingin berhubungan, silakan hubungi:
- Nama: Ikhsan Heriyawan
- Email: ikhsanheriyawan2404@gmail.com
- Website: https://ikhsanheriyawan.netlify.app
