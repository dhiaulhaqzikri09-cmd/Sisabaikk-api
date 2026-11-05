
import { pool } from "../src/db/pool.js";

const stokMinimum = Number(process.argv[2] ?? 1);

if (!Number.isInteger(stokMinimum) || stokMinimum < 0) {
  throw new Error("Stok minimum harus berupa bilangan bulat >= 0.");
}

try {
  const koneksi = await pool.query("SELECT current_database() AS database");

  const hasil = await pool.query(
    `SELECT
       COUNT(*)::int AS jumlah_penawaran,
       COUNT(*) FILTER (WHERE stok <= $1)::int AS stok_rendah,
       COALESCE(SUM(stok), 0)::int AS total_stok
     FROM penawaran`,
    [stokMinimum],
  );

  console.log("PEMERIKSAAN DATABASE SISA BAIK");
  console.log("Database:", koneksi.rows[0].database);
  console.log("Jumlah penawaran:", hasil.rows[0].jumlah_penawaran);
  console.log("Penawaran dengan stok rendah:", hasil.rows[0].stok_rendah);
  console.log("Total stok:", hasil.rows[0].total_stok);
} catch (error) {
  console.error("Pemeriksaan database gagal:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
