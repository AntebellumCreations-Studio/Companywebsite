import { cloudinaryUploadImage,cloudinaryDeleteImage } from "../utils/cloudinary";
const userRoleVerification = (userRole: string|null, level: number): boolean => {
if (userRole){
      userRole = userRole.toLowerCase();

  if (userRole === "admin") return true;              // Admin has all levels
  if (userRole === "staff" && level <= 2) return true; // Staff allowed up to level 2
  if (userRole === "mod" && level === 1) return true;  // Mod allowed only level 1

}

  return false; // Default deny
};
const uploadMultipleFiles = async (files: string[]): Promise<{ secure_url: string; public_id: string }[]> => {
  const uploadPromises = files.map(file => cloudinaryUploadImage(file));
  const results = await Promise.all(uploadPromises);
  return results;
};
export {userRoleVerification ,uploadMultipleFiles}

