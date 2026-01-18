const supabase = require('./config/supabase'); // Adjust path if needed
const crypto = require('crypto');

async function fixCandidateIds() {
    console.log("Starting candidate ID fix...");

    try {
        // 1. Fetch all elections
        const { data: elections, error } = await supabase
            .from('elections')
            .select('*');

        if (error) throw error;

        console.log(`Found ${elections.length} elections.`);

        for (const election of elections) {
            let candidates = election.candidates;
            let needsUpdate = false;

            if (!Array.isArray(candidates)) continue;

            // 2. Check and assign IDs
            const updatedCandidates = candidates.map(c => {
                if (!c.id) {
                    needsUpdate = true;
                    return {
                        ...c,
                        id: crypto.randomUUID()
                    };
                }
                return c;
            });

            // 3. Update if needed
            if (needsUpdate) {
                console.log(`Updating election ${election.id} (${election.title})...`);
                const { error: updateError } = await supabase
                    .from('elections')
                    .update({ candidates: updatedCandidates })
                    .eq('id', election.id);

                if (updateError) {
                    console.error(`Failed to update election ${election.id}:`, updateError);
                } else {
                    console.log(`Successfully updated election ${election.id}`);
                }
            } else {
                console.log(`Election ${election.id} already has valid IDs.`);
            }
        }

        console.log("Fix completed.");

    } catch (err) {
        console.error("Script Error:", err);
    }
}

fixCandidateIds();
