'use client';
import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productLink, setProductLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [pinData, setPinData] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      setImage(result.split(',')[1]);
      setPinData(null);
    };
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    if (!image) return;
    setLoading(true);
    setPinData(null);
    try {
      const res = await fetch('/api/generate-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: image, productName, productLink })
      });
      const data = await res.json();
      setPinData(data);
    } catch (e) {
      alert('Errore. Riprova.');
    }
    setLoading(false);
  };

  const copyField = (value: string, fieldName: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const s = {
    container: { maxWidth: 600, margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, sans-serif' },
    header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 },
    title: { fontSize: 24, fontWeight: 700, margin: 0 },
    badge: { background: '#E60023', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
    uploadLabel: { display: 'block', border: '2px dashed #ddd', borderRadius: 12, textAlign: 'center' as const, cursor: 'pointer', overflow: 'hidden', marginBottom: 16 },
    uploadInner: { padding: 40 },
    img: { width: '100%', maxHeight: 360, objectFit: 'cover' as const, display: 'block' },
    input: { width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: 10, fontSize: 14, marginBottom: 10, boxSizing: 'border-box' as const, fontFamily: 'system-ui' },
    btnGenerate: { width: '100%', background: '#E60023', color: 'white', border: 'none', padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 24 },
    results: { border: '1px solid #eee', borderRadius: 16, overflow: 'hidden', marginTop: 8 },
    resultsHeader: { background: '#1A1A1A', color: 'white', padding: '12px 20px', fontSize: 13, fontWeight: 600 },
    field: { padding: '16px 20px', borderBottom: '1px solid #f0f0f0' },
    fieldTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    fieldLabel: { fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.08em' },
    fieldValue: { fontSize: 14, lineHeight: 1.5, background: '#fafafa', padding: '10px 12px', borderRadius: 8 },
    copyBtn: { border: 'none', padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'system-ui', fontWeight: 500 },
    btnPinterest: { display: 'block', background: '#E60023', color: 'white', textAlign: 'center' as const, padding: 14, borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', margin: '16px 20px 20px' },
  };

  const fields = pinData ? [
    { key: 'board', label: 'BACHECA', value: pinData.board },
    { key: 'title', label: 'TITOLO', value: pinData.title },
    { key: 'description', label: 'DESCRIZIONE', value: pinData.description },
    { key: 'hashtags', label: 'HASHTAG', value: pinData.hashtags.map((t: string) => t.startsWith('#') ? t : '#' + t).join(' ') },
    ...(productLink ? [{ key: 'link', label: 'LINK', value: productLink }] : [])
  ] : [];

  return (
    <main style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>BeKreative</h1>
        <span style={s.badge}>📌 Pinterest</span>
      </div>

      <label style={s.uploadLabel}>
        <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
        {preview ? (
          <img src={preview} style={s.img} alt="preview" />
        ) : (
          <div style={s.uploadInner}>
            <div style={{ fontSize: 40 }}>🖼️</div>
            <div style={{ fontWeight: 600, marginTop: 8 }}>Carica foto prodotto o ambientazione</div>
            <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>JPG, PNG, WEBP</div>
          </div>
        )}
      </label>

      {image && (
        <>
          <input type="text" placeholder="Nome prodotto (es. Vaso Pappagalli Jolipa)" value={productName} onChange={e => setProductName(e.target.value)} style={s.input} />
          <input type="url" placeholder="Link prodotto (https://www.bekreative.it/...)" value={productLink} onChange={e => setProductLink(e.target.value)} style={{ ...s.input, marginBottom: 16 }} />
          <button onClick={generate} disabled={loading} style={{ ...s.btnGenerate, opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Generando...' : '✨ Genera contenuto Pinterest'}
          </button>
        </>
      )}

      {pinData && (
        <div style={s.results}>
          <div style={s.resultsHeader}>📌 PIN PRONTO</div>
          {fields.map(({ key, label, value }) => (
            <div key={key} style={s.field}>
              <div style={s.fieldTop}>
                <div style={s.fieldLabel}>{label}</div>
                <button
                  onClick={() => copyField(value, key)}
                  style={{
                    ...s.copyBtn,
                    background: copiedField === key ? '#2D6A4F' : '#f0f0f0',
                    color: copiedField === key ? 'white' : '#333',
                  }}
                >
                  {copiedField === key ? '✓ Copiato' : 'Copia'}
                </button>
              </div>
              <div style={s.fieldValue}>{value}</div>
            </div>
          ))}
          <a href="https://pinterest.com/pin/creation/button/" target="_blank" style={s.btnPinterest}>
            📌 Apri Pinterest
          </a>
        </div>
      )}
    </main>
  );
}
