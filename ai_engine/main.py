import mediapipe as mp
from flask import Flask, request, jsonify
from deepface import DeepFace
import numpy as np
import cv2
import base64
import math

app = Flask(__name__)

# --- MediaPipe Setup ---
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    min_detection_confidence=0.5, 
    min_tracking_confidence=0.5,
    refine_landmarks=True
)

# --- Helper Functions ---

def decode_image(base64_string):
    """Decodes base64 string to numpy image array."""
    if "base64," in base64_string:
        base64_string = base64_string.split("base64,")[1]
    img_bytes = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def get_head_pose(img, landmarks):
    """Calculates Pitch, Yaw, and Roll from Face Landmarks."""
    img_h, img_w, _ = img.shape
    face_3d = []
    face_2d = []

    # Key landmarks for pose estimation
    # Nose tip: 1, Chin: 152, Left Eye Left Corner: 33, Right Eye Right Corner: 262, Left Mouth Corner: 61, Right Mouth Corner: 291
    lm_indices = [33, 262, 1, 61, 291, 199]

    for idx in lm_indices:
        lm = landmarks[idx]
        x, y = int(lm.x * img_w), int(lm.y * img_h)
        face_2d.append([x, y])
        face_3d.append([x, y, lm.z])

    face_2d = np.array(face_2d, dtype=np.float64)
    face_3d = np.array(face_3d, dtype=np.float64)

    # Camera matrix (approximation)
    focal_length = 1 * img_w
    cam_matrix = np.array([[focal_length, 0, img_h / 2],
                           [0, focal_length, img_w / 2],
                           [0, 0, 1]])
    
    # Distortion coefficients
    dist_matrix = np.zeros((4, 1), dtype=np.float64)

    # PnP solution
    success, rot_vec, trans_vec = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)

    # Rotation matrix
    rmat, jac = cv2.Rodrigues(rot_vec)

    # Angles
    angles, mtxR, mtxQ, Q, Qx, Qy, Qz = cv2.RQDecomp3x3(rmat)

    # Pitch, Yaw, Roll
    x = angles[0] * 360 # Pitch (Up/Down)
    y = angles[1] * 360 # Yaw (Left/Right)
    z = angles[2] * 360 # Roll (Tilt)
    
    return x, y, z

def calculate_ear(landmarks, width, height):
    """Calculates Eye Aspect Ratio."""
    # Left eye indices
    # 33, 160, 158, 133, 153, 144
    
    # Simple vertical/horizontal distance ratio
    # Just checking landmark distances for simplified "wink/blink" logic
    # Using specific points for Eye Opening
    
    # Simplified: Distance between upper and lower eyelid div by eye width
    # Left Eye: Top(159), Bottom(145), Left(33), Right(133)
    
    def dist(p1, p2):
        x1, y1 = p1.x * width, p1.y * height
        x2, y2 = p2.x * width, p2.y * height
        return math.hypot(x2 - x1, y2 - y1)

    # Left Eye
    l_top = landmarks[159]
    l_bot = landmarks[145]
    l_left = landmarks[33]
    l_right = landmarks[133]
    left_ear = dist(l_top, l_bot) / dist(l_left, l_right)

    # Right Eye: Top(386), Bottom(374), Left(362), Right(263)
    r_top = landmarks[386]
    r_bot = landmarks[374]
    r_left = landmarks[362]
    r_right = landmarks[263]
    right_ear = dist(r_top, r_bot) / dist(r_left, r_right)
    
    return left_ear, right_ear

def calculate_mar(landmarks, width, height):
    """Calculates Mouth Aspect Ratio."""
    # Top(13), Bottom(14), Left(61), Right(291)
    
    def dist(p1, p2):
        x1, y1 = p1.x * width, p1.y * height
        x2, y2 = p2.x * width, p2.y * height
        return math.hypot(x2 - x1, y2 - y1)
        
    top = landmarks[13]
    bot = landmarks[14]
    left = landmarks[61]
    right = landmarks[291]
    
    mar = dist(top, bot) / dist(left, right)
    return mar


def check_action(img, action):
    """Verifies if the face in the image is performing the expected action."""
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(img_rgb)

    if not results.multi_face_landmarks:
        return False, "No face detected for liveness check"

    # Get first face
    landmarks = results.multi_face_landmarks[0].landmark
    img_h, img_w, _ = img.shape
    
    pitch, yaw, roll = get_head_pose(img, landmarks)
    left_ear, right_ear = calculate_ear(landmarks, img_w, img_h)
    mar = calculate_mar(landmarks, img_w, img_h)

    print(f"Pose - Pitch: {pitch:.2f}, Yaw: {yaw:.2f}, Roll: {roll:.2f}")
    print(f"EAR - Left: {left_ear:.2f}, Right: {right_ear:.2f}")
    print(f"MAR: {mar:.2f}")

    # --- ACTION LOGIC ---
    # Thresholds need tuning based on camera setup, but these are reasonable defaults
    
    is_success = False
    details = {}

    # --- ACTION LOGIC ---
    # Supports Composite Actions (e.g., "TURN_LEFT+SMILE")
    required_sub_actions = action.split('+')
    
    sub_action_results = []
    
    for sub_action in required_sub_actions:
        sub_success = False
        
        if sub_action == "TURN_LEFT":
            if yaw < -20: sub_success = True
        
        elif sub_action == "TURN_RIGHT":
            if yaw > 20: sub_success = True
            
        elif sub_action == "LOOK_UP":
            if pitch > 10: sub_success = True
            
        elif sub_action == "LOOK_DOWN":
            if pitch < -10: sub_success = True
            
        elif sub_action == "TILT_LEFT":
            if roll > 15: sub_success = True
            
        elif sub_action == "TILT_RIGHT":
            if roll < -15: sub_success = True

        elif sub_action == "SMILE":
            # Simple smile check (MAR low + wide mouth?)
            # Actually MAR increases when smiling loosely, but "Teeth" visibility is best.
            # Simplified: Smile usually means expanding mouth width without opening too much vertically.
            # Let's use a simple placeholder logic or assume 'OPEN_MOUTH' is easier to detect reliably.
            # We will map 'SMILE' to 'OPEN_MOUTH' for robustness in this simple demo unless we add mouth width check.
            # Real implementation: Check distance(61, 291) vs face width.
            pass

        elif sub_action == "OPEN_MOUTH":
            if mar > 0.3: sub_success = True
            
        elif sub_action == "BLINK":
            # Either eye closed
            if left_ear < 0.18 or right_ear < 0.18: sub_success = True
             
        # Log result for this sub-action
        sub_action_results.append(sub_success)
        
    # All parts must be true
    is_success = all(sub_action_results)
    if not required_sub_actions: is_success = False # Safety

    details = {
        "pitch": pitch, "yaw": yaw, "roll": roll,
        "l_ear": left_ear, "r_ear": right_ear, "mar": mar,
        "results": sub_action_results
    }
    
    return is_success, details

# --- Routes ---

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "AI Engine Running", "model": "MediaPipe + VGG-Face"}), 200

@app.route('/generate-embedding', methods=['POST'])
def generate_embedding():
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({"error": "No image provided"}), 400

        img = decode_image(image_data)
        
        # DeepFace for Embedding using Facenet
        embedding_objs = DeepFace.represent(img_path = img, model_name = "Facenet", enforce_detection = False)
        
        if not embedding_objs:
             return jsonify({"error": "Face not detected"}), 400

        embedding = embedding_objs[0]["embedding"]
        return jsonify({"embedding": embedding}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_face_metrics(img):
    """
    Process a single image to get EAR (Eye Aspect Ratio) and validity.
    Returns: (valid_face, left_ear, right_ear)
    """
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(img_rgb)

    if not results.multi_face_landmarks:
        return False, 0, 0

    landmarks = results.multi_face_landmarks[0].landmark
    img_h, img_w, _ = img.shape
    
    left_ear, right_ear = calculate_ear(landmarks, img_w, img_h)
    return True, left_ear, right_ear

@app.route('/verify-liveness', methods=['POST'])
def verify_liveness():
    try:
        data = request.json
        
        # Support both single image (legacy/registration) and multi-image (voting)
        images = data.get('images') # Expecting list of base64 strings
        single_image = data.get('image')
        
        if single_image and not images:
            images = [single_image]
            
        target_embedding = data.get('target_embedding')
        
        if not images:
            return jsonify({"error": "No images provided"}), 400

        # Metrics storage
        processed_frames = []
        
        # 1. ANALYZE ALL FRAMES (LIVENESS)
        for idx, img_b64 in enumerate(images):
            try:
                img = decode_image(img_b64)
                valid, l_ear, r_ear = get_face_metrics(img)
                
                processed_frames.append({
                    "img": img_b64, # Keep base64 for re-use
                    "ear": (l_ear + r_ear) / 2.0,
                    "valid": valid
                })
            except Exception as e:
                print(f"Frame {idx} error: {e}")

        # Need at least 1 valid frame
        valid_frames = [f for f in processed_frames if f['valid']]
        if not valid_frames:
             return jsonify({
                "success": False, 
                "checks": {"liveness": False, "identity": False},
                "error": "No face detected in any frame."
             }), 200

        # --- LIVENESS CHECK ---
        valid_frames.sort(key=lambda x: x['ear'])
        min_ear_frame = valid_frames[0]
        max_ear_frame = valid_frames[-1]
        
        min_ear = min_ear_frame['ear']
        max_ear = max_ear_frame['ear']
        ear_diff = max_ear - min_ear
        
        print(f"Liveness Analysis: Min EAR: {min_ear:.3f}, Max EAR: {max_ear:.3f}, Diff: {ear_diff:.3f}")

        liveness_passed = False
        liveness_msg = "OK"

        if len(images) > 1:
            if ear_diff < 0.02: 
                liveness_passed = False
                liveness_msg = f"Static Face (Diff: {ear_diff:.3f})"
            elif max_ear < 0.15:
                liveness_passed = False
                liveness_msg = f"Eyes not open (Max: {max_ear:.3f})"
            else:
                liveness_passed = True
        else:
            liveness_passed = True # Single frame fallback

        # --- IDENTITY CHECK ---
        identity_passed = False
        identity_msg = "Skipped"
        cosine_distance = 1.0

        if target_embedding:
            try:
                # Use max_ear_frame (best open eyes) for recognition
                # Decode again since we stored base64 (or could optimize)
                best_img_b64 = max_ear_frame['img'] 
                best_img = decode_image(best_img_b64)

                live_objs = DeepFace.represent(img_path = best_img, model_name = "Facenet", enforce_detection = False)
                
                if live_objs:
                    live_embedding = live_objs[0]["embedding"]
                    
                    a = np.array(live_embedding)
                    b = np.array(target_embedding)
                    
                    dot_product = np.dot(a, b)
                    norm_a = np.linalg.norm(a)
                    norm_b = np.linalg.norm(b)
                    
                    cosine_similarity = dot_product / (norm_a * norm_b)
                    cosine_distance = 1 - cosine_similarity
                    
                    print(f"Identity Check: Distance={cosine_distance:.4f} (Threshold: 0.45)")

                    # Relaxed Threshold
                    if cosine_distance < 0.45:
                        identity_passed = True
                        identity_msg = "Match Found"
                    else:
                        identity_passed = False
                        identity_msg = f"Mismatch ({cosine_distance:.2f})"
                else:
                    identity_msg = "Face extraction failed"
            except Exception as e:
                print(f"Identity Check Error: {e}")
                identity_msg = "Error during matching"

        # --- FINAL RESULT ---
        # Both must pass (if target_embedding was provided)
        overall_success = liveness_passed and identity_passed

        return jsonify({
            "success": overall_success,
            "checks": {
                "liveness": liveness_passed,
                "identity": identity_passed
            },
            "messages": {
                "liveness": liveness_msg,
                "identity": identity_msg
            },
            "details": {
                "ear_diff": ear_diff,
                "distance": cosine_distance
            }
        }), 200

    except Exception as e:
        print(f"Backend Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    from waitress import serve
    print("Starting AI Engine with MediaPipe Liveness on port 5001...")
    serve(app, host="0.0.0.0", port=5001)
