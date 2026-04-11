import React, { useState, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Package, Clock } from 'lucide-react';
import { format } from 'date-fns';
import './ReelStockManagement.css';

const ReelStockManagement = ({ reels, setReels }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  const [newReel, setNewReel] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    srNo: '',
    reelNo: '',
    shade: 'N',
    bf: '',
    gsm: '',
    size: '',
    weight: ''
  });

  const handleToggleReel = (id) => {
    const reel = reels.find(r => r.id === id);
    
    if (reel.isCheckedOut) {
      if (window.confirm("Are you sure you want to uncheck (Reel In)?")) {
        setReels(reels.map(r => 
          r.id === id ? { ...r, isCheckedOut: false, outDate: '' } : r
        ));
      }
    } else {
      const istDate = format(new Date(), 'dd/MM/yy HH:mm');
      setReels(reels.map(r => 
        r.id === id ? { ...r, isCheckedOut: true, outDate: istDate } : r
      ));
    }
  };

  const handleAddReel = (e) => {
    e.preventDefault();
    const id = (reels.length + 1).toString();
    setReels([...reels, { ...newReel, id, isCheckedOut: false, outDate: '' }]);
    setShowModal(false);
    setNewReel({
      date: format(new Date(), 'yyyy-MM-dd'),
      srNo: '',
      reelNo: '',
      shade: 'N',
      bf: '',
      gsm: '',
      size: '',
      weight: ''
    });
  };

  const filteredReels = useMemo(() => {
    return reels.filter(r => 
      r.reelNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.srNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reels, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredReels.length / itemsPerPage);
  const currentReels = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReels.slice(start, start + itemsPerPage);
  }, [filteredReels, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="stock-management-container">
      {/* Header & Actions Bar */}
      <div className="section-header mb-4">
        <div className="row align-items-center g-3">
          <div className="col-auto me-auto">
            <h2 className="page-title m-0">Reel Stock Management</h2>
            <p className="text-muted small m-0">Monitor and manage your current inventory real-time.</p>
          </div>
          <div className="col-auto">
            <button 
              className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" 
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} /> Add New Reel
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="main-card shadow-sm border-0">
        <div className="card-header-actions p-3 border-bottom bg-white d-flex align-items-center justify-content-between">
          <div className="search-box">
             <div className="input-group input-group-merge">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                   <Search size={16} />
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="Reel No or SR No..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
             </div>
          </div>
          <div className="total-badge">
             <span className="badge bg-soft-primary text-primary px-3 py-2 rounded-pill">
                Total: {filteredReels.length} Reels
             </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light-header">
              <tr>
                <th className="ps-4">DATE</th>
                <th>SR NO.</th>
                <th>REEL NO.</th>
                <th>SHADE</th>
                <th>BF</th>
                <th>GSM</th>
                <th>SIZE</th>
                <th>WEIGHT</th>
                <th className="text-center">STATUS</th>
                <th className="text-center pe-4">OUT DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {currentReels.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-5">
                     <div className="empty-state">
                        <Package size={40} className="text-muted opacity-25 mb-2" />
                        <p className="text-muted m-0">No reels found matching your criteria.</p>
                     </div>
                  </td>
                </tr>
              ) : (
                currentReels.map((reel) => (
                  <tr key={reel.id} className={reel.isCheckedOut ? 'table-row-out' : ''}>
                    <td className="ps-4 fw-medium">{reel.date}</td>
                    <td>{reel.srNo}</td>
                    <td><span className="fw-bold text-dark">{reel.reelNo}</span></td>
                    <td>{reel.shade}</td>
                    <td>{reel.bf}</td>
                    <td>{reel.gsm}</td>
                    <td>{reel.size}</td>
                    <td><span className="fw-bold text-primary">{reel.weight} <small>kg</small></span></td>
                    <td className="text-center">
                      <div className="form-check d-flex justify-content-center">
                        <input 
                           className="form-check-input cursor-pointer shadow-none" 
                           type="checkbox" 
                           checked={reel.isCheckedOut}
                           onChange={() => handleToggleReel(reel.id)}
                           style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                        />
                      </div>
                    </td>
                    <td className="text-center pe-4">
                      {reel.isCheckedOut ? (
                        <div className="badge-out">
                          <Clock size={12} className="me-1" /> {reel.outDate}
                        </div>
                      ) : (
                        <span className="badge-in">AVAILABLE</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Premium Pagination */}
        <div className="card-footer bg-white border-top p-4">
          <div className="row align-items-center">
            <div className="col text-muted small fw-medium">
               Showing <span className="text-dark fw-bold">{filteredReels.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-dark fw-bold">{Math.min(currentPage * itemsPerPage, filteredReels.length)}</span> of <span className="text-dark fw-bold">{filteredReels.length}</span> entries
            </div>
            <div className="col-auto">
              <nav aria-label="Page navigation">
                <ul className="pagination-premium m-0">
                  <li className={`page-item-custom ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button type="button" className="page-link-custom" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                      <ChevronLeft size={18} />
                    </button>
                  </li>
                  {[...Array(Math.max(1, totalPages))].map((_, i) => (
                    <li key={i + 1} className={`page-item-custom ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button type="button" className="page-link-custom" onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item-custom ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                    <button type="button" className="page-link-custom" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                      <ChevronRight size={18} />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add Stock Modal - Refined */}
      {showModal && (
        <div className="modal show d-block backdrop-blur" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content pro-modal border-0 shadow-lg">
              <div className="modal-header border-bottom-0 p-4 pb-0">
                <div>
                   <h5 className="modal-title fw-bold">Register New Reel</h5>
                   <p className="text-muted small m-0">Enter the details of the incoming reel stock.</p>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAddReel}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="pro-label">Date</label>
                      <input type="date" className="form-control pro-input" value={newReel.date} onChange={(e) => setNewReel({...newReel, date: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="pro-label">SR. NO.</label>
                      <input type="text" className="form-control pro-input" placeholder="e.g. 101" value={newReel.srNo} onChange={(e) => setNewReel({...newReel, srNo: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="pro-label">REEL NO.</label>
                      <input type="text" className="form-control pro-input" placeholder="e.g. ABC-123" value={newReel.reelNo} onChange={(e) => setNewReel({...newReel, reelNo: e.target.value})} required />
                    </div>
                    <div className="col-md-3">
                      <label className="pro-label">SHADE</label>
                      <select className="form-select pro-input" value={newReel.shade} onChange={(e) => setNewReel({...newReel, shade: e.target.value})}>
                        <option value="N">N</option>
                        <option value="G">G</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="pro-label">BF</label>
                      <input type="text" className="form-control pro-input" value={newReel.bf} onChange={(e) => setNewReel({...newReel, bf: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="pro-label">GSM</label>
                      <input type="text" className="form-control pro-input" value={newReel.gsm} onChange={(e) => setNewReel({...newReel, gsm: e.target.value})} required />
                    </div>
                    <div className="col-md-3">
                      <label className="pro-label">SIZE</label>
                      <input type="text" className="form-control pro-input" value={newReel.size} onChange={(e) => setNewReel({...newReel, size: e.target.value})} required />
                    </div>
                    <div className="col-md-3">
                      <label className="pro-label">WEIGHT</label>
                      <div className="input-group">
                         <input type="text" className="form-control pro-input" value={newReel.weight} onChange={(e) => setNewReel({...newReel, weight: e.target.value})} required />
                         <span className="input-group-text bg-light pro-input-append">kg</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0 p-4 pt-0">
                  <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm">Confirm Entry</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelStockManagement;
