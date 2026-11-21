// Shared labels/colours for order and payment states (must match Models/Order.cs on the API)

export const ORDER_STATUS = {
    AwaitingPayment: { label: 'Awaiting Payment', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
    PendingApproval: { label: 'Pending Review', badge: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    Approved: { label: 'Approved', badge: 'bg-green-100 text-green-800 border-green-200' },
    Processing: { label: 'Processing', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
    Shipped: { label: 'Shipped', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
    OutForDelivery: { label: 'Out for Delivery', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    Delivered: { label: 'Delivered', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    Cancelled: { label: 'Cancelled', badge: 'bg-gray-100 text-gray-700 border-gray-300' },
    Rejected: { label: 'Rejected', badge: 'bg-red-100 text-red-800 border-red-200' },
};

export const PAYMENT_STATUS = {
    Unpaid: { label: 'Unpaid', badge: 'bg-gray-100 text-gray-700 border-gray-300' },
    Pending: { label: 'Payment Pending', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
    Paid: { label: 'Paid', badge: 'bg-green-100 text-green-800 border-green-200' },
    Failed: { label: 'Payment Failed', badge: 'bg-red-100 text-red-800 border-red-200' },
    RefundDue: { label: 'Refund Due', badge: 'bg-red-100 text-red-800 border-red-200' },
    Refunded: { label: 'Refunded', badge: 'bg-gray-100 text-gray-700 border-gray-300' },
    ChargedBack: { label: 'Charged Back', badge: 'bg-red-100 text-red-800 border-red-200' },
};

export const PAYMENT_METHOD = {
    COD: 'Cash on Delivery',
    PayHere: 'Card / Wallet (PayHere)',
    Bank: 'Bank Transfer',
    Card: 'Card (legacy)',
};

// The happy path shown as a progress tracker
export const FULFILMENT_STEPS = ['PendingApproval', 'Approved', 'Processing', 'Shipped', 'OutForDelivery', 'Delivered'];

export const statusLabel = (status) => ORDER_STATUS[status]?.label || status;
export const paymentLabel = (status) => PAYMENT_STATUS[status]?.label || status;

export const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
export const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';
export const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '';

// axios error -> readable message (handles plain strings and ASP.NET validation problem details)
export const errorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
    const data = err?.response?.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data?.errors) return Object.values(data.errors).flat().join(' ');
    if (data?.title) return data.title;
    return err?.message || fallback;
};

// Sends the browser to PayHere's hosted checkout by POSTing the signed fields from the API
export const redirectToPayHere = ({ actionUrl, fields }) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = actionUrl;
    Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
};
