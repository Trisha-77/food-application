export const currency = (value) => new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(value || 0);
export const statusClass = (status) => `status ${String(status).toLowerCase().replaceAll(' ', '-')}`;
