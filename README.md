# Backend Test Case

### Identity
Nama: Fajar Abdi Nugraha<br>
Email: nugrahafajar37@gmail.com<br>

### Description
<p>
  Sebelum menjalakan app, rename terlebih dahulu <b><i>.env.example</i></b> menjadi <b><i>.env</i></b><br>
  dan sesuaikan dengan environment dimana aplikasi dijalankan<br>
  untuk database di MySql tidak perlu dibuat nanti akan dibuatkan ketika app dijalankan jika database tidak ada<br>
  untuk seed data pakai Mock Data dari github soal, jika ingin ditambah ada di <b><i>src\databases\seeds</i></b><br>
  seeding dieksekusi setiap aplikasi dijalankan dan hanya akan dilakukan jika data di table kosong, jadi kalau mau merubah seeding pastikan data di table itu kosong<br>
  Untuk swagger ada di <b><i>${HOST_NAME}/swagger</i></b><br>
  Spec di local development:
    <ul>
        <li>Nodejs: v18.6.0
        <li>npm: 8.13.2
        <li>mysql: 8.0.27
  </ul>
</p>

### Running
<h6><i>install dependency</i></h6>
<code>npm install</code>

<h6><i>running test</i></h6>
<code>npm run test</code>

<h6><i>running app</i></h6>
<code>npm run start</code>