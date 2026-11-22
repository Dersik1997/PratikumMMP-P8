# diary-app8 — Modul Praktikum 08: React Redux Toolkit pada React Native

Proyek aplikasi mobile **Diary App** berbasis **React Native + Expo Router** dengan State Management **Redux Toolkit (RTK) & React-Redux**.

---

## A. Perbedaan Local State, Global Redux State, dan Persistent Database (Tugas Praktikum AD.8)

| Aspek | Local State (`useState`) | Global Redux State (`Redux Toolkit`) | Persistent Database (MySQL / SQLite / Storage) |
|---|---|---|---|
| **Definisi** | State yang dimiliki dan dikelola hanya oleh satu komponen internal. | State terpusat (*Single Source of Truth*) yang dapat diakses dan diubah oleh komponen mana saja. | Media penyimpanan permanen di luar memori kerja aplikasi (disk/server). |
| **Penyimpanan** | Memori komponen (hilang saat komponen *unmount*). | Memori aplikasi JavaScript (RAM) selama sesi aplikasi aktif. | Disk penyimpanan lokal atau server database. |
| **Contoh Kasus** | Input form `title`, `body`, dan `mood` saat mengetik di form Tambah/Edit. | Daftar entri diary (`entries`), filter status (`filter`), dan filter mood (`moodFilter`). | Database backend (MySQL/PostgreSQL) atau lokal SQLite/AsyncStorage. |
| **Siklus Hidup** | Reset saat berpindah layar / *unmount*. | Reset ke `initialState` saat aplikasi di-*restart* / di-*reload*. | Tetap tersimpan permanen meskipun aplikasi di-*restart* atau perangkat dimatikan. |

> **Penting:** Redux **bukanlah database**. Redux menyimpan data di memori aplikasi (RAM). Ketika aplikasi di-restart atau di-reload, state akan kembali ke `initialState`. Pada praktikum lanjutan, Redux akan dihubungkan dengan database/API eksternal untuk persistensi data.

---

## B. Fitur yang Diimplementasikan (Sesuai Modul & Tugas Praktikum)

1. **Global State Redux Toolkit:**
   - Redux Store dibuat menggunakan `configureStore()` di `src/app/store.ts`.
   - Typed hooks `useAppDispatch` dan `useAppSelector` di `src/app/hooks.ts`.
   - Slice `diarySlice` di `src/features/diary/diarySlice.ts` dengan Immer untuk manipulasi state yang aman & *predictable*.

2. **CRUD & Interaktivitas State:**
   - **READ (Home Screen):** Membaca daftar catatan dari Redux dan menampilkannya menggunakan `DiaryCard`.
   - **CREATE (Tambah Diary):** Form tambah catatan dengan validasi judul minimal 3 karakter, kemudian di-dispatch dengan action `addDiary`.
   - **UPDATE (Edit Diary - Tugas AD.1 & AD.2):** Layar `app/edit/[id].tsx` dan reducer `editDiary` untuk memperbarui judul, isi, dan mood catatan yang ada.
   - **DELETE (Hapus Diary):** Konfirmasi dialog sebelum menghapus catatan dari store melalui action `deleteDiary`.
   - **TOGGLE FAVORITE:** Menandai atau membatalkan status favorit suatu catatan secara instan melalui action `toggleFavorite`.

3. **Fitur Tambahan Tugas Praktikum (AD.3, AD.4, AD.5, AD.6, AD.7):**
   - **Filter Mood (AD.3):** Filter interaktif di halaman Home berdasarkan mood (`Semua`, `😊`, `😌`, `🔥`, `😢`, `😴`).
   - **Statistik Total Diary & Total Favorite (AD.4):** Widget statistik ringkas di Home menggunakan selector spesifik `entries.length` dan `entries.filter(e => e.liked).length`.
   - **Reset Semua Favorit (AD.5):** Reducer `clearAllFavorites` dengan tombol aksi di layar Favorite.
   - **Validasi Input (AD.6):** Validasi wajib isi dan batas minimal 3 karakter untuk judul diary.
   - **Empty State Informatif (AD.7):** Tampilan visual yang jelas dan ramah ketika belum ada data diary atau belum ada catatan favorit.

---

## C. Struktur Proyek

```text
diary-app8/
├── app/
│   ├── _layout.tsx           # Root layout dengan Redux <Provider>
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom tabs navigation (Home, Tambah, Favorite)
│   │   ├── index.tsx         # Home: List diary, statistik, dan filter mood
│   │   ├── create.tsx        # Tambah: Form tambah diary ke Redux
│   │   └── favorites.tsx     # Favorite: List derived state diary yang disukai
│   ├── detail/
│   │   └── [id].tsx          # Detail Diary, aksi hapus & navigasi edit
│   └── edit/
│       └── [id].tsx          # Screen edit diary melalui Redux
├── src/
│   ├── app/
│   │   ├── store.ts          # Konfigurasi configureStore()
│   │   └── hooks.ts          # Typed hooks useAppDispatch & useAppSelector
│   ├── features/
│   │   └── diary/
│   │       └── diarySlice.ts # Slice: initialState & reducers (add, edit, delete, fav, clear)
│   ├── components/
│   │   └── DiaryCard.tsx     # Komponen reusable kartu diary
│   └── styles/
│       └── tokens.ts         # Design tokens (COLORS, SPACE, RADIUS, TYPO)
├── app.json                  # Konfigurasi Expo Router
└── README.md
```

---

## D. Jawaban Pertanyaan Diskusi (AF)

1. **Mengapa isi TextInput tidak harus disimpan di Redux?**
   - *Jawaban:* Karena isi TextInput selama user mengetik bersifat lokal dan sementara (*transient*). Hanya komponen form itu sendiri yang membutuhkannya. Menyimpan setiap ketukan huruf (*keystroke*) ke Redux akan menyebabkan re-render yang tidak perlu pada komponen lain dan memperlambat performa. Data baru perlu dikirim ke Redux ketika tombol Simpan ditekan.
2. **Apa perbedaan `dispatch(action)` dengan `setState()`?**
   - *Jawaban:* `setState()` mengubah state internal milik satu komponen secara langsung. Sedangkan `dispatch(action)` mengirim objek perintah (*action*) ke Redux Store pusat, di mana *reducer* akan menentukan bagaimana state global diperbarui secara terstruktur dan terpusat.
3. **Apa fungsi reducer?**
   - *Jawaban:* Reducer adalah fungsi murni (*pure function*) yang menerima `(state, action)` dan menghasilkan state baru berdasarkan action yang diterima. Reducer berfungsi sebagai aturan resmi perubahan state aplikasi.
4. **Mengapa Redux Store disebut single source of truth?**
   - *Jawaban:* Karena seluruh data bersama (*shared state*) aplikasi disimpan hanya di satu tempat terpusat (Redux Store), sehingga tidak ada duplikasi data atau inkonsistensi antar layar.
5. **Apa yang terjadi jika dua screen membaca state diary yang sama?**
   - *Jawaban:* Kedua screen akan membaca data yang selalu identik dan sinkron. Ketika salah satu screen mengubah data melalui `dispatch`, screen lain yang membaca data tersebut akan otomatis melakukan re-render dengan data terbaru.
6. **Apa perbedaan action dan reducer?**
   - *Jawaban:* Action adalah deskripsi kejadian yang terjadi (*"apa yang ingin dilakukan"*), contohnya `{ type: 'diary/addDiary', payload: {...} }`. Sedangkan Reducer adalah petugas logika yang memproses action tersebut (*"bagaimana data diubah"*).
7. **Mengapa Redux Toolkit diperkenalkan dibanding Redux klasik?**
   - *Jawaban:* Redux klasik memiliki terlalu banyak boilerplate (*action types*, *action creators*, *immutable spread*, dll.). Redux Toolkit mempermudah pembuatan store (`configureStore`), menyatukan action dan reducer (`createSlice`), menyertakan Immer untuk penulisan mutasi yang aman, serta menyertakan konfigurasi middleware dan Redux DevTools secara bawaan.

---

## E. Cara Menjalankan Proyek

```bash
# 1. Jalankan server Expo dengan membersihkan cache
npx expo start -c

# 2. Buka di:
# - Tekan 'a' untuk Android Emulator
# - Tekan 'w' untuk Web Browser
# - Scan QR code menggunakan aplikasi Expo Go di smartphone
```
