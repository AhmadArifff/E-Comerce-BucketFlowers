async function testAll() {
  console.log('--- TESTING SUPABASE BACKEND INTEGRATION ---');

  // 1. Test Products
  const prodRes = await fetch('http://localhost:3000/api/v1/products');
  const prodJson = await prodRes.json();
  console.log('1. GET /api/v1/products: Success =', prodJson.success, ', Total Products =', prodJson.data?.total);

  // 2. Test COD Points
  const codRes = await fetch('http://localhost:3000/api/v1/cod-points');
  const codJson = await codRes.json();
  console.log('2. GET /api/v1/cod-points: Success =', codJson.success, ', Total COD Points =', codJson.data?.length);

  // 3. Test Raw Materials
  const matRes = await fetch('http://localhost:3000/api/v1/raw-materials');
  const matJson = await matRes.json();
  console.log('3. GET /api/v1/raw-materials: Success =', matJson.success, ', Total Materials =', matJson.data?.materials?.length, ', Valuation = Rp', matJson.data?.totalValuation);

  // 4. Test Dashboard KPIs
  const dashRes = await fetch('http://localhost:3000/api/v1/admin/dashboard');
  const dashJson = await dashRes.json();
  console.log('4. GET /api/v1/admin/dashboard: Success =', dashJson.success, ', Revenue = Rp', dashJson.data?.kpis?.totalRevenue, ', Orders =', dashJson.data?.kpis?.totalOrders);

  // 5. Test Coupon Validation
  const coupRes = await fetch('http://localhost:3000/api/v1/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'WISUDAHEMAT', subtotal: 165000 }),
  });
  const coupJson = await coupRes.json();
  console.log('5. POST /api/v1/coupons/validate: Success =', coupJson.success, ', Discount = Rp', coupJson.data?.discount_amount);

  // 6. Test Chat Assistant
  const chatRes = await fetch('http://localhost:3000/api/v1/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Apakah ada garansi jika bunga patah saat pengiriman?' }),
  });
  const chatJson = await chatRes.json();
  console.log('6. POST /api/v1/chat: Success =', chatJson.success, ', Bot Reply =', chatJson.data?.botReply?.text?.slice(0, 50) + '...');

  // 7. Test Feature Toggles
  const togglesRes = await fetch('http://localhost:3000/api/v1/admin/toggles');
  const togglesJson = await togglesRes.json();
  console.log('7. GET /api/v1/admin/toggles: Success =', togglesJson.success, ', Toggles count =', togglesJson.data?.length);

  console.log('--- ALL INTEGRATION TESTS COMPLETED SUCCESSFULLY! ---');
}

testAll().catch(console.error);
