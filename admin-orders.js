/*************************************************************
 * AROMA LAB — Admin Orders & PnL System
 * File: admin-orders.js — v2
 * 
 * Features:
 * - Pending Orders with Complete modal (Items edit + Discount)
 * - Completed Orders with Delete
 * - Settings (Cost Entry)
 * - Commissions
 * - PnL Report + CSV Download
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
// SUPABASE AUTH
// ============================================================

async function getSupabaseSession() {
  try {
    const { data } = await sb.auth.getSession();
    return data.session;
  } catch (e) {
    return null;
  }
}

async function signInAdmin(password) {
  const { data, error } = await sb.auth.signInWithPassword({
    email: ADMIN_EMAIL_ORDERS,
    password: password
  });
  if (error) throw error;
  return data;
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

async function dbUpdateOrder(orderId, updates) {
  const { data, error } = await sb.from('orders').update(updates).eq('order_id', orderId).select().single();
  if (error) throw error;
  return data;
}

async function dbDeleteOrder(orderId) {
  // 1. Delete order_items first
  const { error: itemsErr } = await sb.from('order_items').delete().eq('order_id', orderId);
  if (itemsErr) throw itemsErr;
  
  // 2. Delete order
  const { error: orderErr } = await sb.from('orders').delete().eq('order_id', orderId);
  if (orderErr) throw orderErr;
  
  return true;
}

// ============================================================
// DATABASE — ORDER ITEMS
// ============================================================

async function dbUpdateOrderItem(itemId, updates) {
  const { data, error } = await sb.from('order_items').update(updates).eq('id', itemId).select().single();
  if (error) throw error;
  return data;
}

async function dbDeleteOrderItem(itemId) {
  const { error } = await sb.from('order_items').delete().eq('id', itemId);
  if (error) throw error;
  return true;
}

async function dbInsertOrderItem(itemData) {
  const { data, error } = await sb.from('order_items').insert([itemData]).select().single();
  if (error) throw error;
  return data;
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
// ORDER LOGIC — Complete with Items + Discount
// ============================================================

async function completeOrder(orderId, completionData) {
  const { 
    order_type, 
    payment_method, 
    delivery_charge, 
    discount,
    commission_override,
    updated_items  // Items list (edited)
  } = completionData;
  
  const order = await dbGetOrderById(orderId);
  const existingItems = await dbGetOrderItems(orderId);
  
  // Products for cost lookup
  const products = await dbGetProducts();
  const productMap = {};
  products.forEach(p => {
    productMap[String(p.name || '').trim().toLowerCase()] = p;
  });
  
  // ---- Step 1: Delete existing items ----
  for (const item of existingItems) {
    await sb.from('order_items').delete().eq('id', item.id);
  }
  
  // ---- Step 2: Insert updated items ----
  let totalAmount = 0;
  let totalCost = 0;
  const itemsSummaryParts = [];
  
  for (const item of (updated_items || [])) {
    const itemName = String(item.product_name || '').trim();
    const qty = Number(item.quantity) || 1;
    const unitPrice = Number(item.unit_price) || 1500;
    const product = productMap[itemName.toLowerCase()];
    const unitCost = product ? (Number(product.total_cost) || Number(product.full_cost) || 0) : 0;
    const totalIncome = unitPrice * qty;
    const totalItemCost = unitCost * qty;
    
    totalAmount += totalIncome;
    totalCost += totalItemCost;
    itemsSummaryParts.push(itemName + ' x' + qty);
    
    await sb.from('order_items').insert([{
      order_id: orderId,
      product_name: itemName,
      quantity: qty,
      unit_price: unitPrice,
      unit_cost: unitCost,
      total_income: totalIncome,
      total_cost: totalItemCost,
      profit: totalIncome - totalItemCost
    }]);
  }
  
  // ---- Step 3: Calculate final numbers ----
  const deliveryCharge = Number(delivery_charge) || 0;
  const discountAmount = Number(discount) || 0;
  
  // Commission calculate
  let commission = Number(commission_override) || 0;
  if (!commission_override && payment_method) {
    const commissions = await dbGetCommissions();
    const comm = commissions.find(c => String(c.method).toLowerCase() === String(payment_method).toLowerCase());
    if (comm) {
      const netForCommission = totalAmount + deliveryCharge - discountAmount;
      commission = (netForCommission * Number(comm.rate) / 100) + Number(comm.fixed_fee || 0);
    }
  }
  
  // Net profit = (Items Total + Delivery − Discount) − Cost − Commission
  const netTotal = totalAmount + deliveryCharge - discountAmount;
  const netProfit = netTotal - totalCost - commission;
  const profitMargin = netTotal > 0 ? (netProfit / netTotal) * 100 : 0;
  
  // ---- Step 4: Update order ----
  const updatedOrder = await dbUpdateOrder(orderId, {
    order_type: order_type || '',
    payment_method: payment_method || '',
    delivery_charge: deliveryCharge,
    discount: discountAmount,
    order_items: itemsSummaryParts.join(', '),
    total_amount: netTotal,  // ← Net total (discount අඩු කරලා)
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
    
    const itemsToInsert = cartItems.map(item => {
      const qty = Number(item.quantity) || 1;
      const unitPrice = 1500;
      const product = productMap[String(item.name || '').trim().toLowerCase()];
      const unitCost = product ? (Number(product.total_cost) || Number(product.full_cost) || 0) : 0;
      const totalIncome = unitPrice * qty;
      const totalItemCost = unitCost * qty;
      
      totalAmount += totalIncome;
      totalCost += totalItemCost;
      itemsSummaryParts.push(item.name + ' x' + qty);
      
      return {
        order_id: orderId,
        product_name: item.name,
        quantity: qty,
        unit_price: unitPrice,
        unit_cost: unitCost,
        total_income: totalIncome,
        total_cost: totalItemCost,
        profit: totalIncome - totalItemCost
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
      discount: 0,
      order_type: '',
      payment_method: '',
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
    
    const { error: itemsErr } = await sb.from('order_items').insert(itemsToInsert);
    if (itemsErr) throw itemsErr;
    
    return { success: true, orderId: orderId };
  } catch (err) {
    console.error('❌ Order save failed:', err);
    return { success: false, error: err.message };
  }
};

// ============================================================
// UI — ADMIN LOGIN MODAL
// ============================================================

function AdminOrdersLogin({ onSuccess, onClose }) {
  const [password, setPassword] = aoUseState('');
  const [error, setError] = aoUseState('');
  const [loading, setLoading] = aoUseState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInAdmin(password);
      onSuccess();
    } catch (err) {
      setError('❌ Wrong password. Try again.');
    }
    setLoading(false);
  }

  return (
    <div className="ao-modal-overlay" onClick={onClose}>
      <div className="ao-auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ao-modal-close" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>×</button>
        <div className="ao-auth-icon">🔐</div>
        <h2 className="ao-auth-title">Admin Access</h2>
        <p className="ao-auth-desc">Enter your admin password to view orders</p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ao-auth-input"
            autoFocus
            required
          />
          {error && <p className="ao-auth-error">{error}</p>}
          <button type="submit" className="ao-auth-btn" disabled={loading}>
            {loading ? 'Checking...' : '🔓 Unlock Orders Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// UI — ADMIN ORDERS PANEL
// ============================================================

function AdminOrdersPanel({ onClose, isAuthenticated, onNeedAuth }) {
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
    if (isAuthenticated) {
      loadOrders();
      
      const channel = sb.channel('orders-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          loadOrders();
        })
        .subscribe();
      
      return () => { sb.removeChannel(channel); };
    }
  }, [isAuthenticated]);
  
  function showMsg(text) {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  }
  
  if (!isAuthenticated) {
    return (
      <div className="ao-overlay">
        <div className="ao-auth-wrapper">
          <AdminOrdersLogin 
            onSuccess={onNeedAuth} 
            onClose={onClose}
          />
        </div>
      </div>
    );
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
                {Number(order.discount) > 0 && (
                  <div className="ao-order-row">
                    <span className="ao-label">Discount:</span>
                    <span className="ao-value" style={{color: '#d97706'}}>− {fmtRs(order.discount)}</span>
                  </div>
                )}
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
            {status === 'completed' && (
              <button className="ao-btn ao-btn-delete" onClick={async () => {
                if (!window.confirm('⚠️ Delete this order permanently?\n\nඑය orders, order_items, PnL සහ හැම තැනකින්ම අයින් වෙනවා.')) return;
                try {
                  await dbDeleteOrder(order.order_id);
                  showMsg('🗑️ Order deleted from entire system');
                  onRefresh();
                } catch (e) {
                  showMsg('Error: ' + e.message);
                }
              }}>
                🗑️ Delete Permanently
              </button>
            )}
            {status === 'cancelled' && (
              <button className="ao-btn ao-btn-delete" onClick={async () => {
                if (!window.confirm('⚠️ Delete this order permanently?')) return;
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
// UI — ORDER COMPLETE MODAL (with Items Edit + Discount)
// ============================================================

function OrderCompleteModal({ order, onClose, onComplete }) {
  const [orderType, setOrderType] = aoUseState('Deliver');
  const [paymentMethod, setPaymentMethod] = aoUseState('Cash');
  const [deliveryCharge, setDeliveryCharge] = aoUseState(order.delivery_charge || 0);
  const [discount, setDiscount] = aoUseState(order.discount || 0);
  const [commission, setCommission] = aoUseState(0);
  const [loading, setLoading] = aoUseState(false);
  const [error, setError] = aoUseState('');
  
  // Items state
  const [items, setItems] = aoUseState([]);
  const [products, setProducts] = aoUseState([]);
  const [showAddItem, setShowAddItem] = aoUseState(false);
  const [newItem, setNewItem] = aoUseState({ product_name: '', quantity: 1 });
  
  const orderTypes = ['Deliver', 'In-Store'];
  const paymentMethods = ['Cash', 'Card', 'Online', 'KOKO', 'Bank', 'Daraz COD'];
  
  // Load items + products
  aoUseEffect(() => {
    async function load() {
      try {
        const its = await dbGetOrderItems(order.order_id);
        setItems(its.map(it => ({
          id: it.id,
          product_name: it.product_name,
          quantity: Number(it.quantity) || 1,
          unit_price: Number(it.unit_price) || 1500,
          unit_cost: Number(it.unit_cost) || 0
        })));
        
        const prods = await dbGetProducts();
        setProducts(prods);
      } catch (e) { console.error(e); }
    }
    load();
  }, [order.order_id]);
  
  // ---- Item actions ----
  function updateItemQty(idx, newQty) {
    if (newQty < 1) return;
    setItems(items.map((it, i) => i === idx ? { ...it, quantity: newQty } : it));
  }
  
  function updateItemPrice(idx, newPrice) {
    setItems(items.map((it, i) => i === idx ? { ...it, unit_price: Number(newPrice) || 0 } : it));
  }
  
  function removeItem(idx) {
    if (!window.confirm('Remove this item?')) return;
    setItems(items.filter((_, i) => i !== idx));
  }
  
  function addNewItem() {
    if (!newItem.product_name) {
      alert('Select a product');
      return;
    }
    const product = products.find(p => p.name === newItem.product_name);
    const unitCost = product ? (Number(product.total_cost) || Number(product.full_cost) || 0) : 0;
    
    setItems([...items, {
      id: null,  // new item
      product_name: newItem.product_name,
      quantity: Number(newItem.quantity) || 1,
      unit_price: 1500,
      unit_cost: unitCost
    }]);
    
    setNewItem({ product_name: '', quantity: 1 });
    setShowAddItem(false);
  }
  
  // ---- Commission auto-calculate ----
  aoUseEffect(() => {
    async function calc() {
      try {
        const comms = await dbGetCommissions();
        const comm = comms.find(c => String(c.method).toLowerCase() === String(paymentMethod).toLowerCase());
        if (comm) {
          const itemsTotal = items.reduce((s, it) => s + (it.unit_price * it.quantity), 0);
          const netForComm = itemsTotal + Number(deliveryCharge) - Number(discount);
          const c = (netForComm * Number(comm.rate) / 100) + Number(comm.fixed_fee || 0);
          setCommission(Math.round(c * 100) / 100);
        } else {
          setCommission(0);
        }
      } catch (e) { console.error(e); }
    }
    calc();
  }, [paymentMethod, items, deliveryCharge, discount]);
  
  async function handleComplete() {
    if (items.length === 0) {
      setError('Order එකේ items අඩුම එකක්වත් තියෙන්න ඕන');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await completeOrder(order.order_id, {
        order_type: orderType,
        payment_method: paymentMethod,
        delivery_charge: Number(deliveryCharge) || 0,
        discount: Number(discount) || 0,
        commission_override: Number(commission) || 0,
        updated_items: items
      });
      onComplete();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }
  
  // ---- Live calculations ----
  const itemsTotal = items.reduce((s, it) => s + (it.unit_price * it.quantity), 0);
  const totalCost = items.reduce((s, it) => s + (it.unit_cost * it.quantity), 0);
  const deliveryNum = Number(deliveryCharge) || 0;
  const discountNum = Number(discount) || 0;
  const commissionNum = Number(commission) || 0;
  const netTotal = itemsTotal + deliveryNum - discountNum;
  const netProfit = netTotal - totalCost - commissionNum;
  
  return (
    <div className="ao-modal-overlay" onClick={onClose}>
      <div className="ao-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ao-modal-header">
          <h3>Complete Order — {order.order_id}</h3>
          <button className="ao-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="ao-modal-body">
          {/* Customer */}
          <div className="ao-modal-section">
            <div className="ao-modal-customer">
              <p><strong>{order.customer_name}</strong></p>
              <p>{order.customer_phone} • {order.district}</p>
            </div>
          </div>
          
          {/* ---- ITEMS SECTION ---- */}
          <div className="ao-modal-section">
            <label className="ao-modal-label">Order Items</label>
            <div className="ao-items-edit-list">
              {items.length === 0 ? (
                <p className="ao-items-empty">No items — add at least one</p>
              ) : (
                items.map((it, idx) => (
                  <div key={idx} className="ao-item-edit-row">
                    <div className="ao-item-edit-name">
                      <div className="ao-item-edit-title">{it.product_name}</div>
                      <div className="ao-item-edit-price">Rs. {it.unit_price} each</div>
                    </div>
                    <div className="ao-item-edit-qty">
                      <button onClick={() => updateItemQty(idx, it.quantity - 1)}>−</button>
                      <span>{it.quantity}</span>
                      <button onClick={() => updateItemQty(idx, it.quantity + 1)}>+</button>
                    </div>
                    <div className="ao-item-edit-total">Rs. {(it.unit_price * it.quantity).toLocaleString()}</div>
                    <button className="ao-item-edit-remove" onClick={() => removeItem(idx)}>✕</button>
                  </div>
                ))
              )}
            </div>
            
            {/* Add Item */}
            {!showAddItem ? (
              <button 
                className="ao-add-item-btn" 
                onClick={() => setShowAddItem(true)}
                disabled={products.length === 0}
              >
                ➕ Add Item
              </button>
            ) : (
              <div className="ao-add-item-form">
                <select 
                  value={newItem.product_name} 
                  onChange={(e) => setNewItem({...newItem, product_name: e.target.value})}
                >
                  <option value="">Select product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  min="1" 
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  placeholder="Qty"
                />
                <button className="ao-btn ao-btn-primary" onClick={addNewItem}>Add</button>
                <button className="ao-btn ao-btn-secondary" onClick={() => { setShowAddItem(false); setNewItem({ product_name: '', quantity: 1 }); }}>Cancel</button>
              </div>
            )}
          </div>
          
          {/* Order Type */}
          <div className="ao-modal-section">
            <label className="ao-modal-label">Order Type</label>
            <select className="ao-modal-input" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              {orderTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          {/* Payment Method */}
          <div className="ao-modal-section">
            <label className="ao-modal-label">Payment Method</label>
            <select className="ao-modal-input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          
          {/* Delivery Charge */}
          <div className="ao-modal-section">
            <label className="ao-modal-label">Delivery Charge (Rs.)</label>
            <input type="number" className="ao-modal-input" value={deliveryCharge} 
              onChange={(e) => setDeliveryCharge(e.target.value)} />
          </div>
          
          {/* ✅ Discount — Delivery Charge එකට පහළින් */}
          <div className="ao-modal-section">
            <label className="ao-modal-label" style={{color: '#d97706'}}>🎁 Discount (Rs.) — Customer ට අඩුවෙන් දුන්නා නම්</label>
            <input type="number" className="ao-modal-input" value={discount} 
              onChange={(e) => setDiscount(e.target.value)} 
              placeholder="0" />
          </div>
          
          {/* Commission */}
          <div className="ao-modal-section">
            <label className="ao-modal-label">Commission (Auto-calculated)</label>
            <input type="number" className="ao-modal-input" value={commission} 
              onChange={(e) => setCommission(e.target.value)} />
          </div>
          
          {/* ---- SUMMARY ---- */}
          <div className="ao-modal-section ao-modal-summary">
            <div className="ao-modal-row"><span>Items Total:</span><span>{fmtRs(itemsTotal)}</span></div>
            <div className="ao-modal-row"><span>Delivery:</span><span>+ {fmtRs(deliveryNum)}</span></div>
            {discountNum > 0 && (
              <div className="ao-modal-row" style={{color: '#d97706'}}><span>Discount:</span><span>− {fmtRs(discountNum)}</span></div>
            )}
            <div className="ao-modal-row" style={{fontWeight: 600, borderTop: '1px solid #eee', paddingTop: '8px'}}>
              <span>Net Total:</span><span>{fmtRs(netTotal)}</span>
            </div>
            <div className="ao-modal-row"><span>Total Cost:</span><span>− {fmtRs(totalCost)}</span></div>
            <div className="ao-modal-row"><span>Commission:</span><span>− {fmtRs(commissionNum)}</span></div>
            <div className="ao-modal-row ao-modal-profit"><span>Net Profit:</span><span>{fmtRs(netProfit)}</span></div>
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
  const [refreshing, setRefreshing] = aoUseState(false);
  const [lastRefresh, setLastRefresh] = aoUseState(null);
  
  aoUseEffect(() => {
    loadProducts();
  }, []);
  
  aoUseEffect(() => {
    const interval = setInterval(() => {
      loadProducts(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  
  aoUseEffect(() => {
    const channel = sb.channel('products-settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        loadProducts(true);
      })
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, []);
  
  async function loadProducts(silent = false) {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const prods = await dbGetProducts();
      setProducts(prods);
      setLastRefresh(new Date());
      
      if (selectedProduct) {
        const updated = prods.find(p => p.id === selectedProduct.id);
        if (updated) setSelectedProduct(updated);
      }
    } catch (e) {
      showMsg('❌ Error: ' + e.message);
    }
    
    if (!silent) setLoading(false);
    else setRefreshing(false);
  }
  
  function handleManualRefresh() {
    loadProducts(true);
    showMsg('🔄 Refreshed!');
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
      await loadProducts(true);
    } catch (e) {
      showMsg('❌ Error: ' + e.message);
    }
  }
  
  const totalCost = (Number(form.bottle_cost) || 0) + (Number(form.label_cost) || 0) + 
                   (Number(form.oil_cost) || 0) + (Number(form.packaging_cost) || 0);
  const profitPerUnit = (Number(form.selling_price) || 0) - totalCost;
  
  const productsWithoutCost = products.filter(p => !p.total_cost || Number(p.total_cost) === 0).length;
  
  return (
    <div className="ao-settings">
      <div className="ao-settings-layout">
        <div className="ao-settings-sidebar">
          <div className="ao-settings-header">
            <h4 className="ao-section-title">Products ({products.length})</h4>
            <button 
              className="ao-refresh-btn" 
              onClick={handleManualRefresh}
              disabled={refreshing}
              title="Refresh products"
            >
              {refreshing ? '⏳' : '🔄'}
            </button>
          </div>
          
          {lastRefresh && (
            <p className="ao-last-refresh">
              Last: {lastRefresh.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          )}
          
          {productsWithoutCost > 0 && (
            <div className="ao-warning-box">
              ⚠️ {productsWithoutCost} product{productsWithoutCost > 1 ? 's' : ''} without cost
            </div>
          )}
          
          {loading ? (
            <p className="ao-loading-small">Loading...</p>
          ) : products.length === 0 ? (
            <div className="ao-empty-small">
              <p>No products yet</p>
              <p style={{fontSize: '11px', opacity: 0.6}}>Add products from Admin Panel → Products tab</p>
            </div>
          ) : (
            products.map(p => (
              <button 
                key={p.id} 
                className={'ao-product-btn ' + (selectedProduct && selectedProduct.id === p.id ? 'active' : '')}
                onClick={() => selectProduct(p)}
              >
                <span className="ao-product-name">{p.name}</span>
                <span className="ao-product-cost">
                  {p.total_cost > 0 ? 'Cost: ' + fmtRs(p.total_cost) : '⚠️ No cost yet'}
                </span>
              </button>
            ))
          )}
        </div>
        
        <div className="ao-settings-main">
          {!selectedProduct ? (
            <div className="ao-empty">
              <p>👈 Select a product to edit costs</p>
            </div>
          ) : (
            <>
              <h3 className="ao-section-title">{selectedProduct.name}</h3>
              <p className="ao-hint">Enter cost breakdown for this product. Auto-refresh every 10s.</p>
              
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
  const totalDiscount = filteredOrders.reduce((s, o) => s + (Number(o.discount) || 0), 0);
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
          <div className="ao-pnl-label">Net Income</div>
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
        {totalDiscount > 0 && (
          <div className="ao-pnl-card">
            <div className="ao-pnl-label">Discounts Given</div>
            <div className="ao-pnl-value" style={{color: '#d97706'}}>{fmtRs(totalDiscount)}</div>
          </div>
        )}
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
  const [authChecked, setAuthChecked] = aoUseState(false);
  const [isAuthenticated, setIsAuthenticated] = aoUseState(false);
  
  aoUseEffect(() => {
    const check = () => {
      let admin = false;
      
      if (window.__currentUser && window.__currentUser.email === ADMIN_EMAIL_ORDERS) {
        admin = true;
      }
      if (window.__adminState === true) {
        admin = true;
      }
      if (window.__adminEmail === ADMIN_EMAIL_ORDERS) {
        admin = true;
      }
      
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
  
  aoUseEffect(() => {
    async function checkAuth() {
      const session = await getSupabaseSession();
      if (session && session.user && session.user.email === ADMIN_EMAIL_ORDERS) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthChecked(true);
    }
    checkAuth();
    
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, [open]);
  
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
      {open && (
        <AdminOrdersPanel 
          onClose={() => setOpen(false)} 
          isAuthenticated={isAuthenticated}
          onNeedAuth={async () => {
            const session = await getSupabaseSession();
            if (session && session.user && session.user.email === ADMIN_EMAIL_ORDERS) {
              setIsAuthenticated(true);
            }
          }}
        />
      )}
    </>
  );
}

// ============================================================
// AUTO-INJECT HEADER BUTTON
// ============================================================

function injectOrdersButton() {
  if (!window.__adminHookInstalled) {
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

console.log('✅ AROMA LAB Admin Orders System v2 loaded');
