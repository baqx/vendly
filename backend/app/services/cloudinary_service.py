import cloudinary
import cloudinary.uploader
from ..core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

class CloudinaryService:
    @staticmethod
    def upload_image(file, folder="vendly/products"):
        try:
            result = cloudinary.uploader.upload(file, folder=folder)
            return result.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
            return None

    @staticmethod
    def delete_image(public_id):
        try:
            cloudinary.uploader.destroy(public_id)
            return True
        except Exception as e:
            print(f"Cloudinary delete error: {e}")
            return False

cloudinary_service = CloudinaryService()
