import { v2 as cloudinary } from 'cloudinary';
import HttpException from '../exceptions/HttpException';
import env from '../config/validateEnv';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

type UploadType = 'cover' | 'profile' | 'post' | 'default';

interface UploadOptions {
  type?: UploadType;
}

const cloudinaryUploadImage = async (
  fileToUpload: string,
  options: UploadOptions = { type: 'default' }
) => {
  try {
    // Build dynamic folder path: e.g. 'cover/2025-06-14'
    const today = new Date().toISOString().slice(0, 10);
    const folderPath = `${options.type || 'default'}/${today}`;

    // Define transformations based on the image type
    let transformation: object[];

    switch (options.type) {
      case 'cover':
        transformation = [
          {
            width: 1280,
            height: 720,
            crop: 'fill',
            gravity: 'auto',
          },
        ];
        break;

      case 'profile':
        transformation = [
          {
            width: 300,
            height: 300,
            crop: 'thumb',
            gravity: 'face',
            radius: 'max',
          },
        ];
        break;

      case 'post':
        transformation = [
          {
            width: 800,
            height: 600,
            crop: 'fill',
            gravity: 'auto',
          },
        ];
        break;

      default:
        transformation = [
          {
            width: 500,
            height: 500,
            crop: 'thumb',
            gravity: 'face',
            radius: 'max',
          },
        ];
    }

    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder: folderPath,
      quality: 80,
      resource_type: 'auto',
      transformation,
    });

    return result;
  } catch (error) {
    throw new HttpException(500, 'Something went wrong while uploading the image');
  }
};

const cloudinaryDeleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new HttpException(500, 'Something went wrong while deleting the image');
  }
};

export { cloudinaryUploadImage, cloudinaryDeleteImage };
