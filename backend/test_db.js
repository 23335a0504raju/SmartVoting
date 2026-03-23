require('dotenv').config();
const supabase = require('./config/supabase');

async function test() {
    console.log("Testing supabase storage...");
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    if (bErr) {
        console.error("Error fetching buckets:", bErr);
    } else {
        const bucketNames = buckets.map(b => b.name);
        console.log("Available Buckets:", bucketNames);
        if (!bucketNames.includes('voter-faces')) {
            console.log("WARNING: 'voter-faces' bucket DOES NOT EXIST!");
        } else {
            console.log("'voter-faces' bucket exists.");
        }
    }
}
test();
