
const url = "https://fleewybijfaltyoftrvm.supabase.co/rest/v1/";
console.log("Testing fetch to:", url);

fetch(url)
  .then(res => {
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
  })
  .catch(err => {
    console.error("Fetch Error:", err);
  });
