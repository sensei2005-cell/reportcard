import React, { useState, useEffect } from 'react';
import './ResultRegister.css';

const PASS = 33;

const initialSubjects = [
  { n: 'Hindi', c: 'Lang. – 101', t: [6, 5, 6, 7], monthlyMax: 40, hy: { mx: 80, ob: 70, pr: 0 }, an: { mx: 80, ob: 75, pr: 0 } },
  { n: 'Mathematics', c: 'Math – 201', t: [6, 5, 6, 7], monthlyMax: 40, hy: { mx: 80, ob: 70, pr: 0 }, an: { mx: 80, ob: 75, pr: 0 } },
  { n: 'English', c: 'Lang. – 102', t: [6, 5, 6, 7], monthlyMax: 40, hy: { mx: 80, ob: 70, pr: 0 }, an: { mx: 80, ob: 75, pr: 0 } },
  { n: 'Social Science', c: 'SS – 301', t: [6, 5, 6, 7], monthlyMax: 40, hy: { mx: 80, ob: 70, pr: 0 }, an: { mx: 80, ob: 75, pr: 0 } },
  { n: 'Science', c: 'Sci – 401', t: [6, 5, 6, 7], monthlyMax: 40, hy: { mx: 80, ob: 70, pr: 0 }, an: { mx: 80, ob: 75, pr: 0 } },
  { n: 'Art & Craft', c: 'Art – 501', t: [6, 5, 6, 7], monthlyMax: 40, hy: { mx: 80, ob: 70, pr: 0 }, an: { mx: 80, ob: 75, pr: 0 } },
  { n: 'Sanskrit / Urdu', c: 'Lang. – 103', t: [6, 5, 6, 7], monthlyMax: 40, hy: { mx: 80, ob: 70, pr: 0 }, an: { mx: 80, ob: 75, pr: 0 } },
  { n: 'Agriculture / Home', c: 'Voc – 601', t: [6, 5, 6, 7], monthlyMax: 40, hy: { mx: 80, ob: 70, pr: 0 }, an: { mx: 80, ob: 75, pr: 0 } },
  { n: 'Physical Training', c: 'PT – 701', t: [6, 5, 6, 7], monthlyMax: 40, hy: { mx: 80, ob: 70, pr: 0 }, an: { mx: 80, ob: 75, pr: 0 } },
];

const gradeInfo = (p) => {
  if (p >= 90) return { l: 'A+', c: 'gAp' };
  if (p >= 80) return { l: 'A', c: 'gA' };
  if (p >= 70) return { l: 'B+', c: 'gBp' };
  if (p >= 60) return { l: 'B', c: 'gB' };
  if (p >= 50) return { l: 'C', c: 'gC' };
  if (p >= 33) return { l: 'D', c: 'gD' };
  return { l: 'F', c: 'gF' };
};

const barCol = (p) => (p >= 75 ? '#22c55e' : p >= 50 ? '#3b82f6' : p >= 33 ? '#f59e0b' : '#ef4444');

export default function ResultRegister() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLogoUrl, setCurrentLogoUrl] = useState(null);
  const [pendingLogoUrl, setPendingLogoUrl] = useState(null);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr("Issued: " + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
  }, []);

  const resetAll = () => {
    setSubjects(subjects.map(s => ({
      ...s,
      t: [0, 0, 0, 0],
      hy: { ...s.hy, ob: 0, pr: 0 },
      an: { ...s.an, ob: 0, pr: 0 }
    })));
  };

  const updateSubject = (index, field, val, subfield = null, testIndex = null) => {
    const newSubjects = [...subjects];
    if (testIndex !== null) {
      newSubjects[index][field][testIndex] = Number(val) || 0;
    } else if (subfield !== null) {
      newSubjects[index][field][subfield] = Number(val) || 0;
    } else {
      newSubjects[index][field] = val;
    }
    setSubjects(newSubjects);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Max 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPendingLogoUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingLogoUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const applyLogo = () => {
    if (pendingLogoUrl) setCurrentLogoUrl(pendingLogoUrl);
    setIsModalOpen(false);
  };

  const removeLogo = () => {
    setCurrentLogoUrl(null);
    setPendingLogoUrl(null);
    setIsModalOpen(false);
  };

  let gObt = 0;
  let gMax = 0;
  let anyFail = false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '100vh', padding: '24px 10px', background: '#cfc8bc', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* LOGO MODAL */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={(e) => { if (e.target.className.includes('modal-overlay')) setIsModalOpen(false); }}>
        <div className="modal">
          <h3>🏫 School Logo</h3>
          <p>Upload your school logo. It will replace the seal in the header. Supports JPG, PNG, SVG, WebP.</p>

          <div
            className="logo-drop"
            onClick={() => document.getElementById('logoFileInput').click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="icon">🖼️</div>
            <strong>Click to browse or drag & drop</strong>
            <p>JPG, PNG, SVG, WebP — max 5MB</p>
          </div>
          <input type="file" id="logoFileInput" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />

          {(pendingLogoUrl || currentLogoUrl) && (
            <div className="logo-preview-wrap" style={{ display: 'block' }}>
              <img src={pendingLogoUrl || currentLogoUrl} alt="Preview" />
              <p style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>Preview — looks good?</p>
            </div>
          )}

          <div className="modal-btns">
            {(currentLogoUrl || pendingLogoUrl) && (
              <button className="btn-sm btn-remove" onClick={removeLogo}>Remove Logo</button>
            )}
            <button className="btn-sm btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
            {(pendingLogoUrl || currentLogoUrl) && (
              <button className="btn-sm btn-apply" onClick={applyLogo}>✓ Apply Logo</button>
            )}
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">
        <span className="toolbar-title">📋 Shan Inter College — Result Register</span>
        <span className="tip">✏️ Every field editable — click any cell, header or text</span>
        <button className="btn btn-logo" onClick={() => setIsModalOpen(true)}>🏫 School Logo</button>
        <button className="btn btn-out" onClick={resetAll}>🔄 Reset</button>
        <button className="btn btn-gold" onClick={() => window.print()}>🖨️ Print / PDF</button>
      </div>

      {/* CARD */}
      <div className="card">
        {/* HEADER */}
        <div className="ch" style={{ position: 'relative' }}>
          <div className="edit-hint">✏️ click text to edit</div>
          <div className="hi">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="seal" onClick={() => setIsModalOpen(true)} title="Click to change logo">
                {currentLogoUrl ? <img src={currentLogoUrl} alt="School Logo" /> : <span>S</span>}
              </div>
              <div className="seal-hint">{currentLogoUrl ? 'click to\nchange' : 'click to\nadd logo'}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="cn" contentEditable suppressContentEditableWarning>Shan Inter College</div>
              <div className="cs" contentEditable suppressContentEditableWarning>Naroda, Moradabad — Uttar Pradesh</div>
              <div className="ca" contentEditable suppressContentEditableWarning>✦ U.P. Board Affiliated &nbsp;|&nbsp; Recognised by Madhyamik Shiksha Parishad, U.P. &nbsp;|&nbsp; Est. 2000</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="badge" contentEditable suppressContentEditableWarning>Examination Result Register</div>
              <div className="bsub" style={{ marginTop: '5px' }}>
                School: <span contentEditable suppressContentEditableWarning style={{ outline: 'none', borderBottom: '1px dashed rgba(255,255,255,.3)', color: 'rgba(255,255,255,.7)' }}>Shan Inter College</span>
                &nbsp;|&nbsp; Session: <span contentEditable suppressContentEditableWarning style={{ outline: 'none', borderBottom: '1px dashed rgba(255,255,255,.3)', color: 'rgba(255,255,255,.7)' }}>2024–25</span>
              </div>
            </div>
          </div>
        </div>

        {/* META STRIP */}
        <div className="meta">
          {[
            ['Student Name', 'Aryan Sharma'], ['Serial No.', '1'], ['Roll No.', '265 / 603'], ['Admission No.', 'SIC-2022-0265'],
            ['Class / Section', 'VIII – A'], ['Stream', 'Science'], ["Father's Name", 'Mr. Rajesh Sharma'], ["Mother's Name", 'Mrs. Sunita Sharma']
          ].map(([label, value], i) => (
            <div className="mc" key={i}>
              <div className="ml" contentEditable suppressContentEditableWarning>{label}</div>
              <div className="mv" contentEditable suppressContentEditableWarning>{value}</div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="twrap">
          <table className="mt">
            <thead>
              <tr className="grp">
                <th rowSpan={2} style={{ background: '#1a3460', width: '22px' }} contentEditable suppressContentEditableWarning>S.No.</th>
                <th rowSpan={2} style={{ background: '#1a3460', textAlign: 'left', paddingLeft: '8px', minWidth: '130px' }} contentEditable suppressContentEditableWarning>Subject / Code</th>
                <th colSpan={4} className="g-mon" contentEditable suppressContentEditableWarning>Monthly Test Marks (Max 20 each)</th>
                <th colSpan={2} className="g-best" contentEditable suppressContentEditableWarning>Marks Obtained</th>
                <th colSpan={4} className="g-hy" contentEditable suppressContentEditableWarning>Half-Yearly Examination</th>
                <th colSpan={4} className="g-an" contentEditable suppressContentEditableWarning>Annual Examination</th>
                <th colSpan={3} className="g-tot" contentEditable suppressContentEditableWarning>Grand Total</th>
                <th rowSpan={2} className="g-tot" style={{ minWidth: '95px' }} contentEditable suppressContentEditableWarning>Result / Remarks</th>
              </tr>
              <tr className="shd">
                <th contentEditable suppressContentEditableWarning>Test I</th>
                <th contentEditable suppressContentEditableWarning>Test II</th>
                <th contentEditable suppressContentEditableWarning>Test III</th>
                <th contentEditable suppressContentEditableWarning>Test IV</th>
                <th style={{ background: '#152d58' }} contentEditable suppressContentEditableWarning>Max</th>
                <th style={{ background: '#152d58' }} contentEditable suppressContentEditableWarning>Obtained</th>
                <th contentEditable suppressContentEditableWarning>Max<br />Marks</th>
                <th contentEditable suppressContentEditableWarning>Marks<br />Obtained</th>
                <th contentEditable suppressContentEditableWarning>Practical</th>
                <th contentEditable suppressContentEditableWarning>Total</th>
                <th contentEditable suppressContentEditableWarning>Max<br />Marks</th>
                <th contentEditable suppressContentEditableWarning>Marks<br />Obtained</th>
                <th contentEditable suppressContentEditableWarning>Practical</th>
                <th contentEditable suppressContentEditableWarning>Total</th>
                <th contentEditable suppressContentEditableWarning>Max<br />Marks</th>
                <th contentEditable suppressContentEditableWarning>Marks<br />Obtained</th>
                <th contentEditable suppressContentEditableWarning>%</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, si) => {
                const totalTests = s.t.reduce((a, b) => a + Number(b || 0), 0);
                const hyObt = Number(s.hy.ob || 0) + Number(s.hy.pr || 0);
                const anObt = Number(s.an.ob || 0) + Number(s.an.pr || 0);
                const totMax = Number(s.hy.mx || 0) + Number(s.an.mx || 0) + (s.monthlyMax || 40);
                const totObt = hyObt + anObt + totalTests;
                const pct = totMax ? (totObt / totMax) * 100 : 0;
                const pass = totMax === 0 || pct >= PASS;
                if (!pass && totMax > 0) anyFail = true;
                const g = gradeInfo(pct);

                gObt += totObt;
                gMax += totMax;

                return (
                  <tr className="sr" key={si}>
                    <td style={{ fontSize: '10px', color: '#8a9ab0', fontWeight: 600 }}>
                      <input className="e" type="number" min="1" value={s.sno || si + 1} style={{ width: '28px', color: '#8a9ab0', fontWeight: 600 }} onChange={(e) => updateSubject(si, 'sno', e.target.value)} />
                    </td>
                    <td className="sn">
                      <input className="e" type="text" value={s.n} placeholder="Subject Name" style={{ width: '100%', fontWeight: 600, fontSize: '11px', textAlign: 'left' }} onChange={(e) => updateSubject(si, 'n', e.target.value)} />
                      <input className="e" type="text" value={s.c} placeholder="Code" style={{ width: '100%', fontSize: '9px', color: '#8a9ab0', textAlign: 'left', marginTop: '2px' }} onChange={(e) => updateSubject(si, 'c', e.target.value)} />
                    </td>
                    {s.t.map((v, ti) => (
                      <td key={ti}>
                        <input className="e" type="number" min="0" max="100" value={v || ''} placeholder="—" style={{ width: '28px' }} onChange={(e) => updateSubject(si, 't', e.target.value, null, ti)} />
                      </td>
                    ))}
                    <td style={{ fontWeight: 700, background: '#eef2f8', color: '#152d58' }}>
                      <input className="e" type="number" min="0" value={s.monthlyMax || 40} style={{ width: '36px', fontWeight: 700, color: '#152d58' }} onChange={(e) => updateSubject(si, 'monthlyMax', e.target.value)} />
                    </td>
                    <td style={{ fontWeight: 700, background: '#eef2f8', color: '#1e3a6e' }}>{totalTests || '—'}</td>

                    <td><input className="e" type="number" min="0" max="999" value={s.hy.mx || ''} placeholder="—" style={{ width: '36px' }} onChange={(e) => updateSubject(si, 'hy', e.target.value, 'mx')} /></td>
                    <td><input className="e" type="number" min="0" max="999" value={s.hy.ob || ''} placeholder="—" style={{ width: '36px' }} onChange={(e) => updateSubject(si, 'hy', e.target.value, 'ob')} /></td>
                    <td><input className="e" type="number" min="0" max="100" value={s.hy.pr || ''} placeholder="—" style={{ width: '30px' }} onChange={(e) => updateSubject(si, 'hy', e.target.value, 'pr')} /></td>
                    <td style={{ fontWeight: 700, color: '#163060', background: '#f0f4fb' }}>{hyObt || '—'}</td>

                    <td><input className="e" type="number" min="0" max="999" value={s.an.mx || ''} placeholder="—" style={{ width: '36px' }} onChange={(e) => updateSubject(si, 'an', e.target.value, 'mx')} /></td>
                    <td><input className="e" type="number" min="0" max="999" value={s.an.ob || ''} placeholder="—" style={{ width: '36px' }} onChange={(e) => updateSubject(si, 'an', e.target.value, 'ob')} /></td>
                    <td><input className="e" type="number" min="0" max="100" value={s.an.pr || ''} placeholder="—" style={{ width: '30px' }} onChange={(e) => updateSubject(si, 'an', e.target.value, 'pr')} /></td>
                    <td style={{ fontWeight: 700, color: '#0f2244', background: '#f5f0e8' }}>{anObt || '—'}</td>

                    <td style={{ fontWeight: 700 }}>{totMax || '—'}</td>
                    <td style={{ fontWeight: 700, color: '#0b1a2e' }}>{totObt || '—'}</td>
                    <td style={{ fontWeight: 700, color: barCol(pct), fontSize: '11px' }}>{totMax ? pct.toFixed(1) + '%' : '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {totMax ? <><span className={`g ${g.c}`}>{g.l}</span><br /></> : ''}
                      {totMax ? (pass ? <span className="pass">✔ Pass</span> : <span className="fail">✘ Fail</span>) : '—'}
                    </td>
                  </tr>
                );
              })}

              {/* TOTAL ROW */}
              <tr className="tr">
                <td colSpan={16} className="lbl">Total / Aggregate</td>
                <td style={{ fontWeight: 800, fontSize: '13px' }}>{gMax}</td>
                <td style={{ fontWeight: 800, fontSize: '13px' }}>{gObt}</td>
                <td colSpan={2}></td>
              </tr>

              {/* SUMMARY ROW */}
              {(() => {
                const overallPct = gMax ? (gObt / gMax) * 100 : 0;
                const g2 = gradeInfo(overallPct);
                const rl = anyFail ? '✘ FAIL' : '✔ PASS';
                const rc = anyFail ? '#f87171' : '#4ade80';

                return (
                  <tr className="sumr">
                    <td colSpan={7} className="lbl">Overall Result / Final Standing</td>
                    <td></td>
                    <td colSpan={4}></td>
                    <td colSpan={4}></td>
                    <td style={{ fontSize: '15px', fontWeight: 800, color: '#e8b655' }}>{gMax}</td>
                    <td style={{ fontSize: '15px', fontWeight: 800, color: '#e8b655' }}>{gObt}</td>
                    <td>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: barCol(overallPct) }}>
                        {overallPct.toFixed(2)}%
                      </div>
                      <div className="bw">
                        <div className="bf" style={{ width: `${overallPct.toFixed(1)}%`, background: barCol(overallPct) }}></div>
                      </div>
                    </td>
                    <td>
                      <span className={`g ${g2.c}`}>{g2.l}</span><br />
                      <span style={{ fontWeight: 800, color: rc }}>{rl}</span>
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>

        {/* BOTTOM */}
        <div className="bot">
          {[
            ['Class Teacher\'s Remarks', 'Excellent performance. Keep it up!', 'Class Teacher', 'Signature & Stamp'],
            ['Parent / Guardian\'s Remarks', '', 'Parent / Guardian', 'Signature'],
            ['Principal\'s Remarks', 'Well done. Strive for higher achievement.', 'Mr. Rajan Verma', 'Principal']
          ].map(([label, text, sigName, sigRole], i) => (
            <div className="bc" key={i}>
              <div className="bl" contentEditable suppressContentEditableWarning>{label}</div>
              <div className="rt" contentEditable suppressContentEditableWarning>{text}</div>
              <div className="sl2"></div>
              <div className="sn2" contentEditable suppressContentEditableWarning>{sigName}</div>
              <div className="sr2" contentEditable suppressContentEditableWarning>{sigRole}</div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="cf">
          <span className="fn" contentEditable suppressContentEditableWarning>This is a computer-generated mark sheet. Any alteration is a punishable offence under applicable law.</span>
          <span className="fs" contentEditable suppressContentEditableWarning>{dateStr}</span>
        </div>
      </div>

      {/* LEGEND */}
      <div className="legend">
        <span className="lt">GRADE SCALE:</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px' }}><span className="g gAp">A+</span>90–100%</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px' }}><span className="g gA">A</span>80–89%</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px' }}><span className="g gBp">B+</span>70–79%</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px' }}><span className="g gB">B</span>60–69%</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px' }}><span className="g gC">C</span>50–59%</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px' }}><span className="g gD">D</span>33–49%</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px' }}><span className="g gF">F</span>&lt;33%</span>
        <span style={{ marginLeft: '10px', fontSize: '10px', color: '#444' }}><b>Pass Marks:</b> 33%</span>
      </div>
    </div>
  );
}
