import numpy as np
from deepface import DeepFace

print("Testing anti-spoofing support...")
img = np.zeros((400, 400, 3), dtype=np.uint8)
try:
    obj = DeepFace.represent(img_path=img, model_name="Facenet", enforce_detection=False, anti_spoofing=True)
    print("Anti spoofing supported:", "is_real" in obj[0])
except TypeError as e:
    print("Anti spoofing not supported kwargs")
except Exception as e:
    print(f"Error {e}")
