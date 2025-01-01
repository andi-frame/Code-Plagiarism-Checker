"use client";

import { useState } from "react";

export default function DetectPlagiarism() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [cosineSimilarity, setCosineSimilarity] = useState<number | null>(null);

  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFile1(file);
  };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFile2(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file1 || !file2) {
      alert("Harap unggah kedua file kode terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    try {
      const res = await fetch("http://127.0.0.1:8000/detect-plagiarism/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Terjadi kesalahan saat memproses file");
      }

      const data = await res.json();
      setCosineSimilarity(data.cosine_similarity);
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengirim permintaan");
    }
  };

  return (
    <div className="container">
      <h1>Deteksi Plagiarisme Kode Program</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file1">Pilih File Kode Asli:</label>
          <input type="file" id="file1" onChange={handleFile1Change} />
        </div>

        <div>
          <label htmlFor="file2">Pilih File Kode yang Mencurigakan:</label>
          <input type="file" id="file2" onChange={handleFile2Change} />
        </div>

        <button type="submit">Periksa Plagiarisme</button>
      </form>

      {cosineSimilarity !== null && (
        <div>
          <h2>Hasil Deteksi Plagiarisme:</h2>
          <p>Cosine Similarity: {cosineSimilarity}</p>
          <p>Hasil: {result}</p>
        </div>
      )}
    </div>
  );
}
