require('dotenv').config();
const supabase = require('./config/supabase');

async function test() {
    console.log("Testing full insertion without AI...");
    try {
        const face_embedding = new Array(128).fill(0.1); 

        const { data, error } = await supabase
            .from('voters')
            .insert([
                {
                    full_name: "Test User",
                    pin_number: "TEST_" + Date.now(),
                    voter_id: "VOA-TEST",
                    email: "test@example.com",
                    phone: "1234567890",
                    password_hash: "mock_hash",
                    face_embedding: face_embedding, 
                    face_image_url: "mock_url",
                    is_verified: true,
                    has_voted: false
                }
            ])
            .select();

        if (error) {
            console.error("Insert Error:", error);
        } else {
            console.log("Insert Success!", data[0].id);
            const { data: fetched, error: fetchErr } = await supabase.from('voters').select('face_embedding').eq('id', data[0].id).single();
            console.log("Fetched typeof:", typeof fetched.face_embedding, Array.isArray(fetched.face_embedding));
            if (typeof fetched.face_embedding === 'string') {
                console.log("Is String representation starting with:", fetched.face_embedding.substring(0, 20));
            }
            await supabase.from('voters').delete().eq('voter_id', 'VOA-TEST');
        }
    } catch(err) {
        console.error("Catch Error:", err);
    }
}
test();
