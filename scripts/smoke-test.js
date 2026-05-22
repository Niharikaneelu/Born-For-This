(async () => {
  try {
    const postRes = await fetch('http://localhost:5173/api/gifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'CI Test', senderName: 'Tester', date: '2000-01-01', identity: 'test', letter: 'hello', stars: [], photoData: null, voiceData: null }),
    });
    console.log('POST status', postRes.status);
    const postBody = await postRes.text();
    console.log('POST body', postBody);

    let id = null;
    try { id = JSON.parse(postBody).id; } catch (e) { /* ignore */ }
    if (!id) {
      console.error('No id returned from POST');
      process.exit(2);
    }

    const getRes = await fetch(`http://localhost:5173/api/gifts/${id}`);
    console.log('GET status', getRes.status);
    console.log('GET body', await getRes.text());
    process.exit(0);
  } catch (e) {
    console.error('Smoke test failed', e);
    process.exit(1);
  }
})();
