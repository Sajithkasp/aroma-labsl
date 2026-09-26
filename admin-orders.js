/*************************************************************
 * AROMA LAB — Admin Orders & PnL System
 * File: admin-orders.js
 * 
 * ⚠️ මේ file එක ඔයාගේ දැනට තියෙන script.js එකට
 *    අත ගහන්නේ නැහැ. අලුතෙන් එකතු වෙන file එකක්.
 *************************************************************/

const { useState: aoUseState, useEffect: aoUseEffect, useRef: aoUseRef } = React;

// ============================================================
// CONFIG
// ============================================================

const ADMIN_EMAIL_ORDERS = "sajith.kasp@gmail.com";
const sb = window.supabaseClient;

// ============================================================
// HELPERS
// ============================================================

function fmtRs(num) {
  const n = Number(num) || 0;
  return 'Rs. ' + n.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function fmtDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDateTime(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return yyyy + '-' + mm + '-' + dd;
}

// ============================================================
// DATABASE — ORDERS
// ============================================================

async function dbGetOrders(status) {
  let query = sb.from('orders').select('*').order('order_date', { ascending: false });
  if (status && status !== 'All') {
    query = query.eq('status', status);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function dbGetOrderById(orderId) {
  const { data, error } = await sb.from('orders').select('*').eq('order_id', orderId).single();
  if (error) throw error;
  return data;
}

async function dbGetOrderItems(orderId) {
  const { data, error } = await sb.from('order_items').select('*').eq('order_id', orderId);
  if (error) throw error;
  return data || [];
}

async function dbCreateOrder(orderData, items) {
  const { data: idData, error: idErr } = await sb.rpc('generate_order_id');
  if (idErr) throw idErr;
  const orderId = idData;
  
  let totalAmount = 0;
  let totalCost = 0;
  const itemsSummaryParts = [];
  
  const { data: products } = await sb.from('products').select('*');
  const productMap = {};
  (products || []).forEach(p => {
    productMap[String(p.name || '').trim().toLowerCase()] = p;
  });
  
  const itemsWithCalc = items.map(item => {
    const qty = Number(item.quantity) || 1;
    const unitPrice = Number(item.unit_price) || 0;
    const product = productMap[String(item.name || '').trim().toLowerCase()];
    const unitCost = product ? (Number(product.total_cost) || Number(product.full_cost) || 0) : 0;
    const totalIncome = unitPrice * qty;
    const totalItemCost = unitCost * qty;
    const profit = totalIncome - totalItemCost;
    
    totalAmount += totalIncome;
    totalCost += totalItemCost;
    itemsSummaryParts.push(item.name + ' x' + qty);
    
    return {
      product_name: item.name,
      quantity: qty,
      unit_price: unitPrice,
      unit_cost: unitCost,
      total_income: totalIncome,
      total_cost: totalItemCost,
      profit: profit
    };
  });
  
  const orderRow = {
    order_id: orderId,
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone || '',
    customer_address: orderData.customer_address || '',
    district: orderData.district || '',
    order_items: itemsSummaryParts.join(', '),
    total_amount: totalAmount,
    delivery_charge: Number(orderData.delivery_charge) || 0,
    order_type: orderData.order_type || '',
    payment_method: orderData.payment_method || '',
    total_cost: totalCost,
    commission: 0,
    other_expenses: 0,
    net_profit: 0,
    profit_margin: 0,
    status: 'Pending',
    platform: orderData.platform || 'Website'
  };
  
  const { data: newOrder, error: orderErr } = await sb.from('orders').insert([orderRow]).select().single();
  if (orderErr) throw orderErr;
  
  const itemsToInsert = itemsWithCalc.map(it => ({ ...it, order_id: orderId }));
  const { error: itemsErr } = await sb.from('order_items').insert(itemsToInsert);
  if (itemsErr) throw itemsErr;
  
  return newOrder;
}

async function dbUpdateOrder(orderId, updates) {
  const { data, error } = await sb.from('orders').update(updates).eq('order_id', orderId).select().single();
  if (error) throw error;
  return data;
}

async function dbDeleteOrder(orderId) {
  await sb.from('order_items').delete().eq('order_id', orderId);
  const { error } = await sb.from('orders').delete().eq('order_id', orderId);
  if (error) throw error;
  return true;
}

// ============================================================
// DATABASE — COMMISSIONS
// ============================================================

async function dbGetCommissions() {
  const { data, error } = await sb.from('commissions').select('*').order('method');
  if (error) throw error;
  return data || [];
}

async function dbUpdateCommission(method, rate, fixedFee, notes) {
  const { data, error } = await sb.from('commissions')
    .update({ 
      rate: Number(rate), 
      fixed_fee: Number(fixedFee) || 0, 
      notes: notes || '', 
      updated_at: new Date().toISOString() 
    })
    .eq('method', method)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// DATABASE — PRODUCTS
// ============================================================

async function dbGetProducts() {
  const { data, error } = await sb.from('products').select('*').order('name');
  if (error) throw error;
  return data || [];
}

async function dbUpdateProductCost(productId, costData) {
  const totalCost = (Number(costData.bottle_cost) || 0) + 
                    (Number(costData.label_cost) || 0) + 
                    (Number(costData.oil_cost) || 0) + 
                    (Number(costData.packaging_cost) || 0);
  const sellingPrice = Number(costData.selling_price) || 0;
  const profitPerUnit = sellingPrice - totalCost;
  
  const { data, error } = await sb.from('products')
    .update({
      cost_type: costData.cost_type || 'Breakdown',
      bottle_cost: Number(costData.bottle_cost) || 0,
      label_cost: Number(costData.label_cost) || 0,
      oil_cost: Number(costData.oil_cost) || 0,
      packaging_cost: Number(costData.packaging_cost) || 0,
      full_cost: totalCost,
      total_cost: totalCost,
      selling_price: sellingPrice,
      profit_per_unit: profitPerUnit
    })
    .eq('id', productId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// DATABASE — EXPENSES
// ============================================================

async function dbGetExpenses() {
  const { data, error } = await sb.from('expenses').select('*').order('expense_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ============================================================
// ORDER LOGIC
// ============================================================

async function completeOrder(orderId, completionData) {
  const { order_type, payment_method, delivery_charge, commission_override } = completionData;
  
  const order = await dbGetOrderById(orderId);
  const items = await dbGetOrderItems(orderId);
  
  const products = await dbGetProducts();
  const productMap = {};
  products.forEach(p => {
    productMap[String(p.name || '').trim().toLowerCase()] = p;
  });
  
  let totalCost = 0;
  for (const item of items) {
    const product = productMap[String(item.product_name || '').trim().toLowerCase()];
    const unitCost = product ? (Number(product.total_cost) || Number(product.full_cost) || 0) : 0;
    const itemTotalCost = unitCost * (Number(item.quantity) || 0);
    totalCost += itemTotalCost;
    
    await sb.from('order_items').update({
      unit_cost: unitCost,
      total_cost: itemTotalCost,
      profit: (Number(item.total_income) || 0) - itemTotalCost
    }).eq('id', item.id);
  }
  
  let commission = Number(commission_override) || 0;
  if (!commission_override && payment_method) {
    const commissions = await dbGetCommissions();
    const comm = commissions.find(c => String(c.method).toLowerCase() === String(payment_method).toLowerCase());
    if (comm) {
      commission = (Number(order.total_amount) * Number(comm.rate) / 100) + Number(comm.fixed_fee || 0);
    }
  }
  
  const deliveryCharge = Number(delivery_charge) || 0;
  const netProfit = Number(order.total_amount) - totalCost - commission + deliveryCharge;
  const profitMargin = Number(order.total_amount) > 0 
    ? (netProfit / Number(order.total_amount)) * 100 
    : 0;
  
  const updatedOrder = await dbUpdateOrder(orderId, {
    order_type: order_type || '',
    payment_method: payment_method || '',
    delivery_charge: deliveryCharge,
    total_cost: totalCost,
    commission: commission,
    net_profit: netProfit,
    profit_margin: profitMargin,
    status: 'Completed',
    updated_at: new Date().toISOString()
  });
  
  return updatedOrder;
}

async function cancelOrder(orderId) {
  return await dbUpdateOrder(orderId, {
    status: 'Cancelled',
    updated_at: new Date().toISOString()
  });
}

// ============================================================
// GLOBAL — Order Place කරද්දී script.js එකෙන් Call කරන Function
// ============================================================

window.saveOrderToSupabase = async function(orderData, cartItems) {
  try {
    const items = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unit_price: 1500
    }));
    
    const result = await dbCreateOrder({
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_address: orderData.customer_address,
      district: orderData.district,
      delivery_charge: orderData.delivery_charge || 0,
      platform: orderData.platform || 'WhatsApp',
      order_type: '',
      payment_method: ''
    }, items);
    
    console.log('✅ Order saved to Supabase:', result.order_id);
    return { success: true, orderId: result.order_id };
  } catch (err) {
    console.error('❌ Failed to save order:', err);
    return { success: false, error: err.message };
  }
};

// ============================================================
// UI — ADMIN ORDERS PANEL
// ============================================================

function AdminOrdersPanel({ onClose }) {
  const [activeTab, setActiveTab] = aoUseState('pending');
  const [pendingOrders, setPendingOrders] = aoUseState([]);
  const [completedOrders, setCompletedOrders] = aoUseState([]);
  const [cancelledOrders, setCancelledOrders] = aoUseState([]);
  const [loading, setLoading] = aoUseState(true);
  const [message, setMessage] = aoUseState('');
  const [selectedOrder, setSelectedOrder] = aoUseState(null);
  
  async function loadOrders() {
    setLoading(true);
    try {
      const [pending, completed, cancelled] = await Promise.all([
        dbGetOrders('Pending'),
        dbGetOrders('Completed'),
        dbGetOrders('Cancelled')
      ]);
      setPendingOrders(pending);
      setCompletedOrders(completed);
      setCancelledOrders(cancelled);
    } catch (err) {
      setMessage('❌ Error loading orders: ' + err.message);
    }
    setLoading(false);
  }
  
  aoUseEffect(() => {
    loadOrders();
    
    const channel = sb.channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();
    
    return () => { sb.removeChannel(channel); };
  }, []);
  
  function showMsg(text) {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  }
  
  return (
    <div className="ao-overlay">
      <div className="ao-panel">
        <div className="ao-header">
          <div className="ao-header-left">
            <h2 className="ao-title">Order Handling & PnL</h2>
            <p className="ao-subtitle">AROMA LAB Business Management</p>
          </div>
          <button className="ao-close" onClick={onClose}>×</button>
        </div>
        
        <div className="ao-tabs">
          <button className={'ao-tab ' + (activeTab === 'pending' ? 'active' : '')} onClick={() => setActiveTab('pending')}>
            Pending
            {pendingOrders.length > 0 && <span className="ao-badge">{pendingOrders.length}</span>}
          </button>
          <button className={'ao-tab ' + (activeTab === 'complete' ? 'active' : '')} onClick={() => setActiveTab('complete')}>
            Complete
            {completedOrders.length > 0 && <span className="ao-badge ao-badge-green">{completedOrders.length}</span>}
          </button>
          <button className={'ao-tab ' + (activeTab === 'cancelled' ? 'active' : '')} onClick={() => setActiveTab('cancelled')}>
            Cancelled
          </button>
          <button className={'ao-tab ' + (activeTab === 'settings' ? 'active' : '')} onClick={() => setActiveTab('settings')}>
            Settings
          </button>
          <button className={'ao-tab ' + (activeTab === 'commissions' ? 'active' : '')} onClick={() => setActiveTab('commissions')}>
            Commissions
          </button>
          <button className={'ao-tab ' + (activeTab === 'pnl' ? 'active' : '')} onClick={() => setActiveTab('pnl')}>
            PnL Report
          </button>
        </div>
        
        {message && <div className="ao-message">{message}</div>}
        
        <div className="ao-content">
          {loading ? (
            <div className="ao-loading">Loading...</div>
          ) : (
            <>
              {activeTab === 'pending' && (
                <OrdersList orders={pendingOrders} status="pending" onRefresh={loadOrders} showMsg={showMsg} onSelectOrder={setSelectedOrder} />
              )}
              {activeTab === 'complete' && (
                <OrdersList orders={completedOrders} status="completed" onRefresh={loadOrders} showMsg={showMsg} onSelectOrder={setSelectedOrder} />
              )}
              {activeTab === 'cancelled' && (
                <OrdersList orders={cancelledOrders} status="cancelled" onRefresh={loadOrders} showMsg={showMsg} onSelectOrder={setSelectedOrder} />
              )}
              {activeTab === 'settings' && <SettingsTab showMsg={showMsg} />}
              {activeTab === 'commissions' && <CommissionsTab showMsg={showMsg} />}
              {activeTab === 'pnl' && <PnLReportTab showMsg={showMsg} />}
            </>
          )}
        </div>
      </div>
      
      {selectedOrder && (
        <OrderCompleteModal 
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onComplete={async () => {
            await loadOrders();
            setSelectedOrder(null);
            showMsg('✅ Order completed successfully!');
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// UI — ORDERS LIST
// ============================================================

function OrdersList({ orders, status, onRefresh, showMsg, onSelectOrder }) {
  if (!orders.length) {
    return (
      <div className="ao-empty">
        <p>No {status} orders</p>
      </div>
    );
  }
  
  return (
    <div className="ao-orders-list">
      {orders.map(order => (
        <div key={order.id} className={'ao-order-card ' + status}>
          <div className="ao-order-header">
            <div>
              <div className="ao-order-id">{order.order_id}</div>
              <div className="ao-order-date">{fmtDateTime(order.order_date)}</div>
            </div>
            <div className={'ao-order-status ao-status-' + status}>
              {order.status}
            </div>
          </div>
          
          <div className="ao-order-body">
            <div className="ao-order-row">
              <span className="ao-label">Customer:</span>
              <span className="ao-value">{order.customer_name}</span>
            </div>
            <div className="ao-order-row">
              <span className="ao-label">Phone:</span>
              <span className="ao-value">{order.customer_phone || '—'}</span>
            </div>
            <div className="ao-order-row">
              <span className="ao-label">District:</span>
              <span className="ao-value">{order.district || '—'}</span>
            </div>
            <div className="ao-order-row">
              <span className="ao-label">Items:</span>
              <span className="ao-value ao-items">{order.order_items || '—'}</span>
            </div>
            <div className="ao-order-row ao-order-total">
              <span className="ao-label">Total:</span>
              <span className="ao-value ao-amount">{fmtRs(order.total_amount)}</span>
            </div>
            
            {status === 'completed' && (
              <>
                <div className="ao-order-row">
                  <span className="ao-label">Profit:</span>
                  <span className="ao-value ao-profit">{fmtRs(order.net_profit)}</span>
                </div>
                <div className="ao-order-row">
                  <span className="ao-label">Payment:</span>
                  <span className="ao-value">{order.payment_method || '—'}</span>
                </div>
                <div className="ao-order-row">
                  <span className="ao-label">Type:</span>
                  <span className="ao-value">{order.order_type || '—'}</span>
                </div>
              </>
            )}
          </div>
          
          <div className="ao-order-actions">
            {status === 'pending' && (
              <>
                <button className="ao-btn ao-btn-complete" onClick={() => onSelectOrder(order)}>
                  ✅ Complete
                </button>
                <button className="ao-btn ao-btn-cancel" onClick={async () => {
                  if (!window.confirm('Cancel this order?')) return;
                  try {
                    await cancelOrder(order.order_id);
                    showMsg('❌ Order cancelled');
                    onRefresh();
                  } catch (e) {
                    showMsg('Error: ' + e.message);
                  }
                }}>
                  ❌ Cancel
                </button>
              </>
            )}
            {status === 'cancelled' && (
              <button className="ao-btn ao-btn-delete" onClick={async () => {
                if (!window.confirm('Delete this order permanently?')) return;
                try {
                  await dbDeleteOrder(order.order_id);
                  showMsg('🗑️ Order deleted');
                  onRefresh();
                } catch (e) {
                  showMsg('Error: ' + e.message);
                }
              }}>
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// UI — ORDER COMPLETE MODAL
// ============================================================

function OrderCompleteModal({ order, onClose, onComplete }) {
  const [orderType, setOrderType] = aoUseState('Deliver');
  const [paymentMethod, setPaymentMethod] = aoUseState('Cash');
  const [deliveryCharge, setDeliveryCharge] = aoUseState(order.delivery_charge || 0);
  const [commission, setCommission] = aoUseState(0);
  const [loading, setLoading] = aoUseState(false);
  const [error, setError] = aoUseState('');
  const [items, setItems] = aoUseState([]);
  
  const orderTypes = ['Deliver', 'In-Store'];
  const paymentMethods = ['Cash', 'Card', 'Online', 'KOKO', 'Bank', 'Daraz COD'];
  
  aoUseEffect(() => {
    async function loadItems() {
      try {
        const its = await dbGetOrderItems(order.order_id);
        setItems(its);
      } catch (e) { console.error(e); }
    }
    loadItems();
  }, [order.order_id]);
  
  aoUseEffect(() => {
    async function calc() {
      try {
        const comms = await dbGetCommissions();
        const comm = comms.find(c => String(c.method).toLowerCase() === String(paymentMethod).toLowerCase());
        if (comm) {
          const c = (Number(order.total_amount) * Number(comm.rate) / 100) + Number(comm.fixed_fee || 0);
          setCommission(Math.round(c * 100) / 100);
        } else {
          setCommission(0);
        }
      } catch (e) { console.error(e); }
    }
    if (paymentMethod) calc();
  }, [paymentMethod, order.total_amount]);
  
  async function handleComplete() {
    setLoading(true);
    setError('');
    try {
      await completeOrder(order.order_id, {
        order_type: orderType,
        payment_method: paymentMethod,
        delivery_charge: Number(deliveryCharge) || 0,
        commission_override: Number(commission) || 0
      });
      onComplete();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }
  
  const deliveryNum = Number(deliveryCharge) || 0;
  const commissionNum = Number(commission) || 0;
  const totalCostEst = items.reduce((s, it) => s + (Number(it.total_cost) || 0), 0);
  const profitEst = Number(order.total_amount) - totalCostEst - commissionNum + deliveryNum;
  
  return (
    <div className="ao-modal-overlay" onClick={onClose}>
      <div className="ao-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ao-modal-header">
          <h3>Complete Order — {order.order_id}</h3>
          <button className="ao-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="ao-modal-body">
          <div className="ao-modal-section">
            <div className="ao-modal-customer">
              <p><strong>{order.customer_name}</strong></p>
              <p>{order.customer_phone} • {order.district}</p>
            </div>
          </div>
          
          <div className="ao-modal-section">
            <label className="ao-modal-label">Order Type</label>
            <select className="ao-modal-input" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              {orderTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          <div className="ao-modal-section">
            <label className="ao-modal-label">Payment Method</label>
            <select className="ao-modal-input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          
          <div className="ao-modal-section">
            <label className="ao-modal-label">Delivery Charge (Rs.)</label>
            <input type="number" className="ao-modal-input" value={deliveryCharge} 
              onChange={(e) => setDeliveryCharge(e.target.value)} />
          </div>
          
          <div className="ao-modal-section">
            <label className="ao-modal-label">Commission (Auto-calculated)</label>
            <input type="number" className="ao-modal-input" value={commission} 
              onChange={(e) => setCommission(e.target.value)} />
          </div>
          
          <div className="ao-modal-section ao-modal-summary">
            <div className="ao-modal-row"><span>Total Amount:</span><span>{fmtRs(order.total_amount)}</span></div>
            <div className="ao-modal-row"><span>Total Cost:</span><span>- {fmtRs(totalCostEst)}</span></div>
            <div className="ao-modal-row"><span>Commission:</span><span>- {fmtRs(commissionNum)}</span></div>
            <div className="ao-modal-row"><span>Delivery:</span><span>+ {fmtRs(deliveryNum)}</span></div>
            <div className="ao-modal-row ao-modal-profit"><span>Net Profit:</span><span>{fmtRs(profitEst)}</span></div>
          </div>
          
          {error && <div className="ao-modal-error">❌ {error}</div>}
        </div>
        
        <div className="ao-modal-footer">
          <button className="ao-btn ao-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="ao-btn ao-btn-primary" onClick={handleComplete} disabled={loading}>
            {loading ? 'Processing...' : '✅ Confirm Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// UI — SETTINGS TAB
// ============================================================

function SettingsTab({ showMsg }) {
  const [products, setProducts] = aoUseState([]);
  const [selectedProduct, setSelectedProduct] = aoUseState(null);
  const [form, setForm] = aoUseState({
    cost_type: 'Breakdown',
    bottle_cost: 0,
    label_cost: 0,
    oil_cost: 0,
    packaging_cost: 0,
    selling_price: 1500
  });
  const [loading, setLoading] = aoUseState(true);
  
  aoUseEffect(() => {
    loadProducts();
  }, []);
  
  async function loadProducts() {
    setLoading(true);
    try {
      const prods = await dbGetProducts();
      setProducts(prods);
    } catch (e) {
      showMsg('❌ Error: ' + e.message);
    }
    setLoading(false);
  }
  
  function selectProduct(p) {
    setSelectedProduct(p);
    setForm({
      cost_type: p.cost_type || 'Breakdown',
      bottle_cost: p.bottle_cost || 0,
      label_cost: p.label_cost || 0,
      oil_cost: p.oil_cost || 0,
      packaging_cost: p.packaging_cost || 0,
      selling_price: p.selling_price || p.price || 1500
    });
  }
  
  async function handleSave() {
    if (!selectedProduct) return;
    try {
      await dbUpdateProductCost(selectedProduct.id, form);
      showMsg('✅ Product cost updated!');
      await loadProducts();
    } catch (e) {
      showMsg('❌ Error: ' + e.message);
    }
  }
  
  const totalCost = (Number(form.bottle_cost) || 0) + (Number(form.label_cost) || 0) + 
                   (Number(form.oil_cost) || 0) + (Number(form.packaging_cost) || 0);
  const profitPerUnit = (Number(form.selling_price) || 0) - totalCost;
  
  return (
    <div className="ao-settings">
      <div className="ao-settings-layout">
        <div className="ao-settings-sidebar">
          <h4 className="ao-section-title">Products</h4>
          {loading ? (
            <p>Loading...</p>
          ) : (
            products.map(p => (
              <button 
                key={p.id} 
                className={'ao-product-btn ' + (selectedProduct && selectedProduct.id === p.id ? 'active' : '')}
                onClick={() => selectProduct(p)}
              >
                <span className="ao-product-name">{p.name}</span>
                <span className="ao-product-cost">
                  {p.total_cost > 0 ? 'Cost: ' + fmtRs(p.total_cost) : '⚠️ No cost'}
                </span>
              </button>
            ))
          )}
        </div>
        
        <div className="ao-settings-main">
          {!selectedProduct ? (
            <div className="ao-empty">
              <p>Select a product to edit costs</p>
            </div>
          ) : (
            <>
              <h3 className="ao-section-title">{selectedProduct.name}</h3>
              <p className="ao-hint">Enter cost breakdown for this product</p>
              
              <div className="ao-form-grid">
                <div className="ao-form-field">
                  <label>Cost Type</label>
                  <select value={form.cost_type} onChange={(e) => setForm({...form, cost_type: e.target.value})}>
                    <option value="Breakdown">Breakdown</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>
                <div className="ao-form-field">
                  <label>Bottle Cost (Rs.)</label>
                  <input type="number" value={form.bottle_cost} 
                    onChange={(e) => setForm({...form, bottle_cost: e.target.value})} />
                </div>
                <div className="ao-form-field">
                  <label>Label Cost (Rs.)</label>
                  <input type="number" value={form.label_cost} 
                    onChange={(e) => setForm({...form, label_cost: e.target.value})} />
                </div>
                <div className="ao-form-field">
                  <label>Oil Cost (Rs.)</label>
                  <input type="number" value={form.oil_cost} 
                    onChange={(e) => setForm({...form, oil_cost: e.target.value})} />
                </div>
                <div className="ao-form-field">
                  <label>Packaging Cost (Rs.)</label>
                  <input type="number" value={form.packaging_cost} 
                    onChange={(e) => setForm({...form, packaging_cost: e.target.value})} />
                </div>
                <div className="ao-form-field">
                  <label>Selling Price (Rs.)</label>
                  <input type="number" value={form.selling_price} 
                    onChange={(e) => setForm({...form, selling_price: e.target.value})} />
                </div>
              </div>
              
              <div className="ao-summary-box">
                <div className="ao-summary-row"><span>Total Cost:</span><span>{fmtRs(totalCost)}</span></div>
                <div className="ao-summary-row"><span>Profit per Unit:</span><span className="ao-profit">{fmtRs(profitPerUnit)}</span></div>
              </div>
              
              <button className="ao-btn ao-btn-primary" onClick={handleSave}>
                💾 Save Cost
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// UI — COMMISSIONS TAB
// ============================================================

function CommissionsTab({ showMsg }) {
  const [commissions, setCommissions] = aoUseState([]);
  const [loading, setLoading] = aoUseState(true);
  const [editData, setEditData] = aoUseState({});
  
  aoUseEffect(() => {
    loadCommissions();
  }, []);
  
  async function loadCommissions() {
    setLoading(true);
    try {
      const comms = await dbGetCommissions();
      setCommissions(comms);
      const ed = {};
      comms.forEach(c => {
        ed[c.method] = { rate: c.rate, fixed_fee: c.fixed_fee, notes: c.notes };
      });
      setEditData(ed);
    } catch (e) {
      showMsg('❌ Error: ' + e.message);
    }
    setLoading(false);
  }
  
  async function saveCommission(method) {
    try {
      const d = editData[method];
      await dbUpdateCommission(method, d.rate, d.fixed_fee, d.notes);
      showMsg('✅ ' + method + ' commission updated!');
      await loadCommissions();
    } catch (e) {
      showMsg('❌ Error: ' + e.message);
    }
  }
  
  if (loading) return <div className="ao-loading">Loading...</div>;
  
  return (
    <div className="ao-commissions">
      <h3 className="ao-section-title">Bank & Payment Commissions</h3>
      <p className="ao-hint">Rates edit කරන්න. ඊළඟ orders වලට auto apply වෙනවා.</p>
      
      <div className="ao-comm-grid">
        {commissions.map(c => (
          <div key={c.method} className="ao-comm-card">
            <div className="ao-comm-header">
              <span className={'ao-comm-badge ao-comm-' + c.method.toLowerCase()}>{c.method}</span>
            </div>
            <div className="ao-form-field">
              <label>Rate (%)</label>
              <input type="number" step="0.01" value={editData[c.method]?.rate || 0}
                onChange={(e) => setEditData({
                  ...editData,
                  [c.method]: { ...editData[c.method], rate: e.target.value }
                })} />
            </div>
            <div className="ao-form-field">
              <label>Fixed Fee (Rs.)</label>
              <input type="number" value={editData[c.method]?.fixed_fee || 0}
                onChange={(e) => setEditData({
                  ...editData,
                  [c.method]: { ...editData[c.method], fixed_fee: e.target.value }
                })} />
            </div>
            <div className="ao-form-field">
              <label>Notes</label>
              <input type="text" value={editData[c.method]?.notes || ''}
                onChange={(e) => setEditData({
                  ...editData,
                  [c.method]: { ...editData[c.method], notes: e.target.value }
                })} />
            </div>
            <button className="ao-btn ao-btn-primary" onClick={() => saveCommission(c.method)}>
              💾 Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// UI — PNL REPORT TAB
// ============================================================

function PnLReportTab({ showMsg }) {
  const [orders, setOrders] = aoUseState([]);
  const [expenses, setExpenses] = aoUseState([]);
  const [loading, setLoading] = aoUseState(true);
  const [dateRange, setDateRange] = aoUseState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: todayStr()
  });
  
  aoUseEffect(() => {
    loadData();
  }, []);
  
  async function loadData() {
    setLoading(true);
    try {
      const [ords, exps] = await Promise.all([
        dbGetOrders('Completed'),
        dbGetExpenses()
      ]);
      setOrders(ords);
      setExpenses(exps);
    } catch (e) {
      showMsg('❌ Error: ' + e.message);
    }
    setLoading(false);
  }
  
  function filterByDate(arr, dateField) {
    if (!dateRange.from || !dateRange.to) return arr;
    return arr.filter(item => {
      const d = item[dateField] ? new Date(item[dateField]).toISOString().split('T')[0] : '';
      return d >= dateRange.from && d <= dateRange.to;
    });
  }
  
  const filteredOrders = filterByDate(orders, 'order_date');
  const filteredExpenses = filterByDate(expenses, 'expense_date');
  
  const totalIncome = filteredOrders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
  const totalCost = filteredOrders.reduce((s, o) => s + (Number(o.total_cost) || 0), 0);
  const totalCommission = filteredOrders.reduce((s, o) => s + (Number(o.commission) || 0), 0);
  const totalExpenses = filteredExpenses.reduce((s, e) => s + (Number(e.total_cost) || 0), 0);
  const netProfit = totalIncome - totalCost - totalCommission - totalExpenses;
  const margin = totalIncome > 0 ? (netProfit / totalIncome * 100) : 0;
  
  function getDailyData() {
    const map = {};
    filteredOrders.forEach(o => {
      const d = o.order_date ? new Date(o.order_date).toISOString().split('T')[0] : '';
      if (!map[d]) map[d] = { date: d, orders: 0, income: 0, profit: 0 };
      map[d].orders += 1;
      map[d].income += Number(o.total_amount) || 0;
      map[d].profit += Number(o.net_profit) || 0;
    });
    return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
  }
  
  function downloadCSV() {
    const data = getDailyData();
    let csv = 'Date,Orders,Income,Profit\n';
    data.forEach(d => {
      csv += d.date + ',' + d.orders + ',' + d.income + ',' + d.profit + '\n';
    });
    csv += '\nTotal,' + filteredOrders.length + ',' + totalIncome + ',' + netProfit + '\n';
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aroma-lab-pnl-' + todayStr() + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    showMsg('✅ CSV downloaded');
  }
  
  if (loading) return <div className="ao-loading">Loading...</div>;
  
  const dailyData = getDailyData();
  
  return (
    <div className="ao-pnl">
      <h3 className="ao-section-title">Profit & Loss Report</h3>
      
      <div className="ao-pnl-filters">
        <div className="ao-form-field">
          <label>From</label>
          <input type="date" value={dateRange.from} onChange={(e) => setDateRange({...dateRange, from: e.target.value})} />
        </div>
        <div className="ao-form-field">
          <label>To</label>
          <input type="date" value={dateRange.to} onChange={(e) => setDateRange({...dateRange, to: e.target.value})} />
        </div>
        <button className="ao-btn ao-btn-secondary" onClick={() => {
          const today = todayStr();
          setDateRange({ from: today, to: today });
        }}>Today</button>
        <button className="ao-btn ao-btn-secondary" onClick={() => {
          const d = new Date();
          setDateRange({ 
            from: new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0],
            to: todayStr()
          });
        }}>This Month</button>
        <button className="ao-btn ao-btn-primary" onClick={downloadCSV}>📥 Download CSV</button>
      </div>
      
      <div className="ao-pnl-summary">
        <div className="ao-pnl-card ao-pnl-income">
          <div className="ao-pnl-label">Total Income</div>
          <div className="ao-pnl-value">{fmtRs(totalIncome)}</div>
        </div>
        <div className="ao-pnl-card ao-pnl-cost">
          <div className="ao-pnl-label">Product Cost</div>
          <div className="ao-pnl-value">{fmtRs(totalCost)}</div>
        </div>
        <div className="ao-pnl-card ao-pnl-comm">
          <div className="ao-pnl-label">Commission</div>
          <div className="ao-pnl-value">{fmtRs(totalCommission)}</div>
        </div>
        <div className="ao-pnl-card ao-pnl-exp">
          <div className="ao-pnl-label">Expenses</div>
          <div className="ao-pnl-value">{fmtRs(totalExpenses)}</div>
        </div>
        <div className="ao-pnl-card ao-pnl-profit">
          <div className="ao-pnl-label">Net Profit</div>
          <div className="ao-pnl-value">{fmtRs(netProfit)}</div>
          <div className="ao-pnl-margin">Margin: {margin.toFixed(1)}%</div>
        </div>
      </div>
      
      <h4 className="ao-section-title" style={{marginTop: '30px'}}>Daily Breakdown</h4>
      <div className="ao-table-wrap">
        <table className="ao-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Orders</th>
              <th>Income</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No data for this period</td></tr>
            ) : (
              dailyData.map(d => (
                <tr key={d.date}>
                  <td>{fmtDate(d.date)}</td>
                  <td>{d.orders}</td>
                  <td>{fmtRs(d.income)}</td>
                  <td className="ao-profit">{fmtRs(d.profit)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// HEADER BUTTON — Multi-method Admin Detection
// ============================================================

function OrdersButton() {
  const [isAdmin, setIsAdmin] = aoUseState(false);
  const [open, setOpen] = aoUseState(false);
  
  aoUseEffect(() => {
    const check = () => {
      let admin = false;
      
      // Method 1: window.__currentUser (හැම විදිහකින්ම set කරන්න try කරනවා)
      if (window.__currentUser && window.__currentUser.email === ADMIN_EMAIL_ORDERS) {
        admin = true;
      }
      
      // Method 2: window.__adminState (script.js එකෙන් set වෙනවා නම්)
      if (window.__adminState === true) {
        admin = true;
      }
      
      // Method 3: window.__adminEmail
      if (window.__adminEmail === ADMIN_EMAIL_ORDERS) {
        admin = true;
      }
      
      // Method 4: DOM-based — "⚙️ Admin" icon එක පේනවා නම්, ඒ කියන්නේ admin
      const adminIconBtn = document.querySelector('.admin-btn-highlight');
      if (adminIconBtn) {
        admin = true;
      }
      
      setIsAdmin(admin);
    };
    
    check();
    const interval = setInterval(check, 700);
    return () => clearInterval(interval);
  }, []);
  
  if (!isAdmin) return null;
  
  return (
    <>
      <button 
        className="ao-header-btn" 
        onClick={() => setOpen(true)}
        title="Order Handling & PnL"
      >
        📊 Orders & PnL
      </button>
      {open && <AdminOrdersPanel onClose={() => setOpen(false)} />}
    </>
  );
}

// ============================================================
// AUTO-INJECT HEADER BUTTON
// ============================================================

function injectOrdersButton() {
  // Hook into script.js's checkAdmin
  if (!window.__adminHookInstalled) {
    // Firebase user track (from onAuthStateChanged in index.html)
    const origSetAppUser = window.setAppUser;
    if (origSetAppUser && !window.__setAppUserWrapped) {
      window.setAppUser = function(user) {
        if (user) {
          window.__currentUser = { email: user.email, displayName: user.displayName };
        } else {
          window.__currentUser = null;
        }
        return origSetAppUser.apply(this, arguments);
      };
      window.__setAppUserWrapped = true;
    }
    
    // checkAdmin hook
    const origCheckAdmin = window.checkAdmin;
    if (origCheckAdmin) {
      window.checkAdmin = function(email) {
        if (email === ADMIN_EMAIL_ORDERS) {
          window.__currentUser = { email: email };
          window.__adminEmail = email;
          window.__adminState = true;
        } else if (!email) {
          window.__adminState = false;
        }
        return origCheckAdmin.apply(this, arguments);
      };
      window.__adminHookInstalled = true;
    }
  }
  
  // Mount button into header
  const checkAndMount = setInterval(() => {
    const header = document.querySelector('.header-icons');
    if (header && !document.getElementById('ao-header-btn-mount')) {
      const mount = document.createElement('div');
      mount.id = 'ao-header-btn-mount';
      mount.style.display = 'inline-flex';
      mount.style.alignItems = 'center';
      mount.style.marginRight = '8px';
      header.insertBefore(mount, header.firstChild);
      
      const root = ReactDOM.createRoot(mount);
      root.render(<OrdersButton />);
      
      clearInterval(checkAndMount);
    }
  }, 500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectOrdersButton);
} else {
  injectOrdersButton();
}

console.log('✅ AROMA LAB Admin Orders System loaded');
