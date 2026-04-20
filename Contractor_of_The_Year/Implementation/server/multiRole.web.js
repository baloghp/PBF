import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';
import wixUsersBackend from 'wix-users-backend';
import { authorization, authentication } from 'wix-members-backend';

export const getUserRoles = webMethod(Permissions.Anyone, async () => {
    const user = wixUsersBackend.currentUser;
    if (!user.loggedIn) return { loggedIn: false, roleNames: [] };

    const roles = await user.getRoles();
    // We map to names so we can easily check .includes("Judge") on the frontend
    const roleNames = roles.map(r => r.name);

    const [coachCheck, assessorCheck] = await Promise.all([
            wixData.query("Coaches").eq("userId", user.id).limit(1).find({ suppressAuth: true }),
            wixData.query("Assessors").eq("userId", user.id).limit(1).find({ suppressAuth: true })
        ]);

        if (coachCheck.items.length > 0) {
            roleNames.push("Nominee Coach");
        }

        if (assessorCheck.items.length > 0) {
            roleNames.push("Assessor");
        }

    return { loggedIn: true, roleNames: roleNames };
});

// TOOL 2: Assign the role to the currently logged-in user
export const assignNomineeRoleToCurrentUser = webMethod(Permissions.Anyone, async () => {
    const user = wixUsersBackend.currentUser;
    if (!user.loggedIn) throw new Error("Must be logged in.");

    // 1. Assign the Role 
    const roleId = "b7fc44e8-e5a8-4035-9a99-875f0f85bd4e"; 
    // 2. ASSIGN ROLE
    await authorization.assignRole(roleId, user.id, { suppressAuth: true });
    console.log("Role Assigned Successfully");

      // 3. GET EMAIL (New Step!)
    // The new token generator needs the EMAIL, not the ID.
    const userEmail = await user.getEmail();

    // 4. GENERATE TOKEN (Pass Email here)
    const sessionToken = await authentication.generateSessionToken(userEmail);
    console.log("Token Generated");
    
    return { 
        sessionToken: sessionToken, 
        redirectUrl: '/nominee-dashboard' 
    };
   
});