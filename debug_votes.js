const supabase = require('./backend/config/supabase');

async function checkVotes() {
    console.log("Checking Votes Table...");
    const { data, error } = await supabase
        .from('votes')
        .select('*');

    if (error) {
        console.error("Error:", error);
    } else {
        console.log(`Found ${data.length} votes.`);
        console.log(JSON.stringify(data, null, 2));
    }
}

checkVotes();
