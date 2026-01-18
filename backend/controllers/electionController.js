const supabase = require('../config/supabase');

exports.getAllElections = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('elections')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createElection = async (req, res) => {
    try {
        console.log("Create Election Request Body:", req.body);
        console.log("Create Election Files:", req.files);

        const { name, serialNumber, electionType, startAt, endAt, createdBy, candidates: candidatesString } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Election Name (title) is missing." });
        }

        let candidates = [];
        try {
            // FormData sends arrays/objects as JSON strings
            candidates = JSON.parse(candidatesString);
        } catch (e) {
            return res.status(400).json({ error: "Invalid candidates format." });
        }

        // Upload images if they exist and assign IDs
        if (candidates) {
            candidates = await Promise.all(candidates.map(async (candidate, index) => {
                // Assign unique ID if missing
                const candidateId = candidate.id || require('crypto').randomUUID();

                // Find file for this candidate.
                let symbolUrl = candidate.symbolUrl;
                if (req.files && req.files.length > 0) {
                    const fileField = `candidate_${index}_symbol`;
                    const file = req.files.find(f => f.fieldname === fileField);

                    if (file) {
                        const fileExt = file.originalname.split('.').pop();
                        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                        const filePath = `symbols/${fileName}`;

                        try {
                            const { error: uploadError } = await supabase.storage
                                .from('symbols')
                                .upload(filePath, file.buffer, {
                                    contentType: file.mimetype
                                });

                            if (uploadError) throw uploadError;

                            const { data } = supabase.storage
                                .from('symbols')
                                .getPublicUrl(filePath);

                            symbolUrl = data.publicUrl;
                        } catch (err) {
                            console.error(`Failed to upload symbol for ${candidate.name}:`, err);
                        }
                    }
                }

                return {
                    ...candidate,
                    id: candidateId,
                    symbolUrl
                };
            }));
        }

        // Auto-generate Code: ELEC + YYYY + MM + DD + Random
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
        const code = `ELEC${year}${month}${day}${random}`;

        // Validate Candidates Structure
        if (!candidates || !Array.isArray(candidates) || candidates.length < 2) {
            return res.status(400).json({ error: "At least 2 candidates required details." });
        }

        const { data, error } = await supabase
            .from('elections')
            .insert([{
                code,
                title: name,
                serial_number: serialNumber,
                election_type: electionType,
                start_at: startAt,
                end_at: endAt,
                description: '',
                status: 'active',
                candidates, // Storing full object array with URLs
                created_by: createdBy
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        console.error("Create Election Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateElectionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('elections')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateElection = async (req, res) => {
    try {
        const { id } = req.params;

        // When using FormData, basic fields are in body, files in req.files
        const updates = req.body;
        const files = req.files || [];

        // Parse candidates if sent as string (FormData)
        let candidates = [];
        if (typeof updates.candidates === 'string') {
            try {
                candidates = JSON.parse(updates.candidates);
            } catch (e) {
                return res.status(400).json({ error: "Invalid candidates JSON format." });
            }
        } else {
            candidates = updates.candidates || [];
        }

        // Handle new file uploads for candidates
        if (files.length > 0) {
            candidates = await Promise.all(candidates.map(async (candidate, index) => {
                // Find file for this candidate (using the field name convention from frontend)
                const fileField = `candidate_${index}_symbol`;
                const file = files.find(f => f.fieldname === fileField);

                if (file) {
                    const fileExt = file.originalname.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                    const filePath = `symbols/${fileName}`;

                    try {
                        const { error: uploadError } = await supabase.storage
                            .from('symbols')
                            .upload(filePath, file.buffer, {
                                contentType: file.mimetype
                            });

                        if (uploadError) throw uploadError;

                        const { data } = supabase.storage
                            .from('symbols')
                            .getPublicUrl(filePath);

                        // Return candidate with NEW symbol URL
                        return {
                            ...candidate,
                            symbolUrl: data.publicUrl
                        };
                    } catch (err) {
                        console.error(`Failed to upload symbol for ${candidate.name}:`, err);
                        return candidate; // Keep existing data on failure
                    }
                }

                // If no new file, candidate object already has 'symbolUrl' from the JSON parsing
                return candidate;
            }));
        }

        const { data, error } = await supabase
            .from('elections')
            .update({
                title: updates.name || updates.title,
                election_type: updates.electionType,
                start_at: updates.startAt,
                end_at: updates.endAt,
                status: updates.status,
                candidates: candidates
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        console.error("Update Election Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getElectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('elections')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkVoteStatus = async (req, res) => {
    try {
        const { id } = req.params; // election_id
        const { userId } = req.query; // Assuming userId is passed as query param

        if (!userId) return res.status(400).json({ error: "User ID is required" });

        const { data, error } = await supabase
            .from('votes')
            .select('*')
            .eq('election_id', id)
            .eq('voter_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"

        res.json({ hasVoted: !!data });
    } catch (error) {
        console.error("Check Vote Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.castVote = async (req, res) => {
    try {
        const { id } = req.params; // election_id
        const { userId, candidateId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // 1. Check if already voted
        const { data: existingVote, error: checkError } = await supabase
            .from('votes')
            .select('*')
            .eq('election_id', id)
            .eq('voter_id', userId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error("Check Vote Error:", checkError);
            throw checkError;
        }

        if (existingVote) {
            return res.status(400).json({ error: "You have already voted in this election." });
        }

        // 2. Insert Vote
        const { error: voteError } = await supabase
            .from('votes')
            .insert([{ election_id: id, voter_id: userId, candidate_id: candidateId }]);

        if (voteError) throw voteError;

        // 3. Increment Candidate Vote Count
        const { data: election, error: fetchError } = await supabase
            .from('elections')
            .select('candidates')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        let candidates = election.candidates;
        // Identify candidate by ID.
        const candidateIdx = candidates.findIndex(c => c.id === candidateId || String(c.id) === String(candidateId));

        if (candidateIdx !== -1) {
            candidates[candidateIdx].votes = (candidates[candidateIdx].votes || 0) + 1;

            const { error: updateError } = await supabase
                .from('elections')
                .update({ candidates })
                .eq('id', id);

            if (updateError) throw updateError;
        }

        res.json({ message: "Vote cast successfully" });

    } catch (error) {
        console.error("Cast Vote Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getVoterHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // 1. Fetch all votes by this user
        const { data: votes, error: voteError } = await supabase
            .from('votes')
            .select('*')
            .eq('voter_id', userId)
            .order('timestamp', { ascending: false });

        if (voteError) throw voteError;

        if (!votes || votes.length === 0) {
            return res.json([]);
        }

        // 2. Enhance with Election and Candidate details
        const history = await Promise.all(votes.map(async (vote) => {
            const { data: election } = await supabase
                .from('elections')
                .select('title, candidates')
                .eq('id', vote.election_id)
                .single();

            let candidateName = "Unknown / NOTA";
            let candidateSymbol = null;
            let candidateBranch = "";
            let candidateAge = "";

            if (election && election.candidates) {
                if (vote.candidate_id === 'nota') {
                    candidateName = "NOTA (None of the Above)";
                } else {
                    const candidate = election.candidates.find(c => c.id === vote.candidate_id);
                    if (candidate) {
                        candidateName = candidate.name;
                        candidateSymbol = candidate.symbolUrl;
                        candidateBranch = candidate.branch;
                        candidateAge = candidate.age;
                    }
                }
            }

            return {
                id: vote.id,
                electionTitle: election ? election.title : "Unknown Election",
                candidateName,
                candidateSymbol,
                candidateBranch,
                candidateAge,
                votedAt: vote.timestamp
            };
        }));

        res.json(history);

    } catch (error) {
        console.error("Fetch Vote History Error:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.announceResults = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Fetch current description to append tag
        const { data: currentData, error: fetchError } = await supabase
            .from('elections')
            .select('description')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        let newDescription = currentData.description || '';
        // Avoid double tagging
        if (!newDescription.includes('[ANNOUNCED]')) {
            newDescription = `[ANNOUNCED] ${newDescription}`;
        }

        // 2. Update status to 'closed' (valid constraint) and description
        const { data, error } = await supabase
            .from('elections')
            .update({
                status: 'closed',
                description: newDescription
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        console.error("Announce Results Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.withdrawResults = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Fetch current description
        const { data: currentData, error: fetchError } = await supabase
            .from('elections')
            .select('description')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        let newDescription = currentData.description || '';
        // Remove tag
        if (newDescription.includes('[ANNOUNCED]')) {
            newDescription = newDescription.replace('[ANNOUNCED]', '').trim();
        }

        // 2. Update description (status remains closed/completed as per requirement)
        const { data, error } = await supabase
            .from('elections')
            .update({
                description: newDescription
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        console.error("Withdraw Results Error:", error);
        res.status(500).json({ error: error.message });
    }
};
