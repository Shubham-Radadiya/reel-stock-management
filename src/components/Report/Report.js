import React, { useState, useMemo } from 'react';
import { BarChart3, Database, RefreshCcw } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import './Report.css';

const Report = ({ reels }) => {
  const [filterType, setFilterType] = useState('all'); // 'all', 'date', 'month'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  // 1. Filter Data based on selection
  const filteredData = useMemo(() => {
    return reels.filter(reel => {
      if (filterType === 'date' && selectedDate) {
        return reel.date === selectedDate || (reel.isCheckedOut && reel.outDate.includes(format(parseISO(selectedDate), 'dd/MM/yy')));
      }
      if (filterType === 'month' && selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        const reelDate = parseISO(reel.date);
        return reelDate.getMonth() + 1 === parseInt(month) && reelDate.getFullYear() === parseInt(year);
      }
      return true;
    });
  }, [reels, filterType, selectedDate, selectedMonth]);

  // 2. Pivot Logic for Matrix (Available Reels Only)
  const availableReels = filteredData.filter(r => !r.isCheckedOut);
  
  const matrix = useMemo(() => {
    const sizes = [...new Set(availableReels.map(r => r.size))].sort((a, b) => parseFloat(a) - parseFloat(b));
    const combinations = []; // Array of { shade, bf, gsm, key }
    
    availableReels.forEach(r => {
      const key = `${r.shade}_${r.bf}_${r.gsm}`;
      if (!combinations.find(c => c.key === key)) {
        combinations.push({ shade: r.shade, bf: r.bf, gsm: r.gsm, key });
      }
    });

    // Sort combinations by Shade, then BF, then GSM
    combinations.sort((a, b) => {
      if (a.shade !== b.shade) return a.shade.localeCompare(b.shade);
      if (a.bf !== b.bf) return parseFloat(a.bf) - parseFloat(b.bf);
      return parseFloat(a.gsm) - parseFloat(b.gsm);
    });

    return { sizes, combinations };
  }, [availableReels]);

  const getCount = (size, comboKey) => {
    return availableReels.filter(r => r.size === size && `${r.shade}_${r.bf}_${r.gsm}` === comboKey).length;
  };

  const totals = {
    all: filteredData.length,
    out: filteredData.filter(r => r.isCheckedOut).length,
    in: filteredData.filter(r => !r.isCheckedOut).length
  };

  return (
    <div className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0 text-primary-dark">Report Center</h2>
        <div className="d-flex gap-2">
           <button className="btn btn-light border" onClick={() => setFilterType('all')}><RefreshCcw size={16} className="me-2" /> Reset</button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="glass-card mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small fw-bold text-muted">Filter Type</label>
            <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Records</option>
              <option value="date">Specific Date</option>
              <option value="month">Monthly Overview</option>
            </select>
          </div>
          
          {filterType === 'date' && (
            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted">Select Date</label>
              <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
          )}

          {filterType === 'month' && (
            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted">Select Month</label>
              <input type="month" className="form-control" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card border-start border-primary border-5">
          <span className="stat-label">Total Reels</span>
          <span className="stat-value text-primary">{totals.all}</span>
        </div>
        <div className="stat-card border-start border-danger border-5">
          <span className="stat-label">Reels Out (Sold)</span>
          <span className="stat-value text-danger">{totals.out}</span>
        </div>
        <div className="stat-card border-start border-success border-5">
          <span className="stat-label">Reels In (Stock)</span>
          <span className="stat-value text-success">{totals.in}</span>
        </div>
      </div>

      {/* The Matrix */}
      <div className="glass-card">
        <div className="d-flex align-items-center gap-2 mb-4">
          <BarChart3 className="text-primary" />
          <h4 className="fw-bold m-0">Stock Availability Matrix</h4>
        </div>

        {availableReels.length === 0 ? (
          <div className="text-center py-5">
            <Database size={48} className="text-light mb-3" />
            <p className="text-muted">No stock available for the selected filters.</p>
          </div>
        ) : (
          <div className="custom-table-container">
            <table className="custom-table matrix-table border shadow-sm">
              <thead>
                <tr className="matrix-header-shade">
                  <th rowSpan="3" className="border">SIZE</th>
                  {matrix.combinations.map(c => <th key={c.key} className="border">{c.shade}</th>)}
                  <th rowSpan="3" className="border grand-total-cell">TOTAL</th>
                </tr>
                <tr className="matrix-header-bf">
                  {matrix.combinations.map(c => <th key={c.key} className="border">{c.bf}</th>)}
                </tr>
                <tr className="matrix-header-gsm">
                  {matrix.combinations.map(c => <th key={c.key} className="border">{c.gsm}</th>)}
                </tr>
              </thead>
              <tbody>
                {matrix.sizes.map(size => {
                  let rowTotal = 0;
                  return (
                    <tr key={size}>
                      <td className="fw-bold border-end">{size}</td>
                      {matrix.combinations.map(combo => {
                        const count = getCount(size, combo.key);
                        rowTotal += count;
                        return (
                          <td key={combo.key} className={count > 0 ? 'fw-bold text-primary border' : 'text-light border'}>
                            {count || ''}
                          </td>
                        );
                      })}
                      <td className="fw-bold bg-light border">{rowTotal}</td>
                    </tr>
                  );
                })}
                <tr className="bg-light fw-bold text-dark">
                  <td className="border">TOTAL</td>
                  {matrix.combinations.map(combo => (
                    <td key={combo.key} className="border">
                      {availableReels.filter(r => `${r.shade}_${r.bf}_${r.gsm}` === combo.key).length}
                    </td>
                  ))}
                  <td className="grand-total-cell border">{availableReels.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
