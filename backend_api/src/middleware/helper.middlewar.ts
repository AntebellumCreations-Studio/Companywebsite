const userRoleVerification = (userRole: string|null, level: number): boolean => {
if (userRole){
      userRole = userRole.toLowerCase();

  if (userRole === "admin") return true;              // Admin has all levels
  if (userRole === "staff" && level <= 2) return true; // Staff allowed up to level 2
  if (userRole === "mod" && level === 1) return true;  // Mod allowed only level 1

}

  return false; // Default deny
};
export {userRoleVerification}