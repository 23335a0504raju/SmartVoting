import cv2
import numpy as np
from deepface import DeepFace

print("Testing DeepFace represent...")
# Create two random 'image' arrays (noise)
img1 = np.random.randint(0, 255, (400, 400, 3), dtype=np.uint8)
img2 = np.random.randint(0, 255, (400, 400, 3), dtype=np.uint8)

try:
    # enforce_detection=False so it embeds the noise
    emb1 = DeepFace.represent(img_path=img1, model_name="Facenet", enforce_detection=False)[0]["embedding"]
    emb2 = DeepFace.represent(img_path=img2, model_name="Facenet", enforce_detection=False)[0]["embedding"]
    
    a = np.array(emb1)
    b = np.array(emb2)
    
    cosine_similarity = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
    cosine_distance = 1 - cosine_similarity
    
    print(f"Cosine Distance between two random noise images: {cosine_distance:.4f}")
except Exception as e:
    print(f"Error: {e}")
