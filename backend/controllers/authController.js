const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const aiService = require('../services/aiService');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Helper to generate Voter ID
const generateVoterId = (pin) => {
    return `VOA-${pin.toUpperCase()}`;
};

// Voter Registration (Face Auth)
exports.registerVoter = async (req, res) => {
    try {
        const { full_name, pin_number, email, phone, password, biometricData } = req.body;

        if (!pin_number || !biometricData || !password) {
            return res.status(400).json({ error: 'Pin number, Password, and Face Image are required' });
        }

        // Check if voter already exists
        const { data: existingUser } = await supabase
            .from('voters')
            .select('*')
            .or(`pin_number.eq.${pin_number},email.eq.${email},phone.eq.${phone}`)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'User with this Pin, Email, or Phone already exists' });
        }

        console.log("Generating Face Embedding for:", pin_number);
        // Generate Embedding from AI Engine
        const face_embedding = await aiService.generateEmbedding(biometricData);

        const voter_id = generateVoterId(pin_number);

        // Hash Password
        const password_hash = await bcrypt.hash(password, 10);

        // Upload to Supabase Storage
        const base64Data = biometricData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `voters/${pin_number}_${Date.now()}.jpg`;

        const { data: storageData, error: storageError } = await supabase
            .storage
            .from('voter-faces')
            .upload(fileName, buffer, {
                contentType: 'image/jpeg'
            });

        if (storageError) {
            console.error("Storage Upload Error:", storageError);
            // Proceed? Or fail? Let's fail if storage fails as user explicitly requested bucket storage.
            throw new Error("Failed to upload face image to storage: " + storageError.message);
        }

        const { data: publicUrlData } = supabase
            .storage
            .from('voter-faces')
            .getPublicUrl(fileName);

        const face_image_url = publicUrlData.publicUrl;

        // Insert into Supabase
        const { data, error } = await supabase
            .from('voters')
            .insert([
                {
                    full_name,
                    pin_number,
                    voter_id,
                    email,
                    phone,
                    password_hash,
                    face_embedding,
                    face_image_url, // Store Bucket URL
                    is_verified: true,
                    has_voted: false
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({ message: 'Voter registered successfully', voterId: voter_id });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Voter Login (Password Only)
exports.loginVoter = async (req, res) => {
    try {
        const { contact, password } = req.body; // contact: pin, email, or phone

        if (!contact || !password) {
            return res.status(400).json({ error: 'Contact and Password are required' });
        }

        // Fetch user by Voter ID
        const { data: voter, error } = await supabase
            .from('voters')
            .select('*')
            .eq('voter_id', contact) // Use exact match for Voter ID
            .single();

        if (error || !voter) {
            return res.status(401).json({ error: 'Voter not found' });
        }

        // 1. Verify Password
        if (!voter.password_hash) {
            // If legacy user without password or face-only user... user requested add password field.
            // If no hash, maybe fail? Or skip? Let's assume mandatory for security now.
            return res.status(401).json({ error: 'Password not set for this user.' });
        }

        // NOTE: In Register, we store 'password' directly in previous steps (bad practice but simplified for this prototype's history).
        // Let's check Register code earlier. Register.js sends 'password'.
        // authController.registerVoter code (Step 235 view) does:
        // const { full_name, ..., password, ... } = req.body;
        // BUT wait, in schema view (Step 167), password_hash is text.
        // In Register (Step 235 code around line 40), it inserts { ..., password, ...} ?
        // Line 40 in Step 235 snippet:
        // .insert([{ full_name, ..., face_embedding, ... }])
        // It does NOT include password or password_hash in the insert block in Step 235!
        // CHECK line 40-54 in Step 235 carefully.
        // It lists: full_name, pin_number, voter_id, email, phone, face_embedding, is_verified, has_voted.
        // IT DOES NOT INSERT PASSWORD.
        // This is a bug if we want to verify password. We must fix Register to store password_hash too!

        // Let's fix that too.

        // For now, I will write the login logic assuming password_hash exists. 
        // I will need a separate edit to fix Register to actually store the password.

        const isPasswordMatch = await bcrypt.compare(password, voter.password_hash);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate Token
        const token = jwt.sign({ id: voter.id, role: 'voter' }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: voter.id,
                name: voter.full_name,
                voter_id: voter.voter_id,
                pin_number: voter.pin_number,
                email: voter.email,
                phone: voter.phone,
                role: 'voter',
                has_voted: voter.has_voted,
                gender: voter.gender,
                class: voter.class,
                dob: voter.dob,
                branch: voter.branch
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Admin Login (Password Based)
exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !admin) {
            return res.status(401).json({ error: 'Invalid Admin credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid Admin credentials' });
        }

        const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: admin.id,
                name: admin.username,
                role: 'admin'
            }
        });

    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Seed Admin
exports.seedAdmin = async (req, res) => {
    const { username, password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from('admins')
        .insert([{ username, password_hash }]).select();

    if (error) {
        console.error("Seed Admin Error:", error);
        return res.status(500).json({ error: error.message || "Database error" });
    }
    res.json(data);
};

// Update Voter Profile
exports.updateProfile = async (req, res) => {
    try {
        console.log("Update Profile Request:", req.body);
        const { id, gender, class: voterClass, dob, branch } = req.body;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const { data, error } = await supabase
            .from('voters')
            .update({
                gender,
                class: voterClass,
                dob,
                branch
            })
            .eq('id', id)
            .select();

        console.log("Supabase Update Result:", { data, error });

        if (error) {
            console.error("Update Profile Error:", error);
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "User not found or no changes made." });
        }

        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Current User Profile (Refresh specific)
exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const { data: voter, error } = await supabase
            .from('voters')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !voter) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            id: voter.id,
            name: voter.full_name,
            voter_id: voter.voter_id,
            pin_number: voter.pin_number,
            email: voter.email,
            phone: voter.phone,
            role: 'voter',
            has_voted: voter.has_voted,
            gender: voter.gender,
            class: voter.class,
            dob: voter.dob,
            branch: voter.branch
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify Voter Face for Voting
exports.verifyVoterFace = async (req, res) => {
    try {
        // Support 'images' (array for blink check) or 'image' (single for legacy)
        const { voterId, images, image } = req.body;

        const imageList = images || (image ? [image] : []);

        if (!voterId || imageList.length === 0) {
            return res.status(400).json({ error: "Voter ID and Face Image(s) are required" });
        }

        // 1. Fetch Voter's Stored Embedding
        const { data: voter, error } = await supabase
            .from('voters')
            .select('face_embedding')
            .eq('id', voterId)
            .single();

        if (error || !voter) {
            return res.status(404).json({ error: "Voter not found" });
        }

        if (!voter.face_embedding) {
            return res.status(400).json({ error: "Face ID not set up for this voter." });
        }

        // 2. Parse embedding
        let storedEmbedding = voter.face_embedding;
        if (typeof storedEmbedding === 'string') {
            storedEmbedding = JSON.parse(storedEmbedding);
        }

        // 3. Call AI Service (Blink Verification)
        const result = await aiService.verifyLiveness(imageList, storedEmbedding);

        if (result.success) {
            res.json({ success: true, message: "Liveness & Identity Verified Successfully" });
        } else {
            // Forward detailed checks and messages from AI Engine
            res.status(401).json({
                success: false,
                error: result.error || "Verification failed.",
                checks: result.checks,
                messages: result.messages,
                details: result.details
            });
        }

    } catch (error) {
        console.error("Verification Error:", error);
        // Specialized error handling
        if (error.type === 'entity.too.large') {
            return res.status(413).json({ error: "Payload too large. Please retry." });
        }
        res.status(500).json({ error: error.message });
    }
};
