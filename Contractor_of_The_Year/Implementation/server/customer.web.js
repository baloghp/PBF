import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';
import wixUsersBackend from 'wix-users-backend';

// 1. GET ALL CUSTOMERS FOR THIS USER
export const getMyCustomers = webMethod(Permissions.Anyone, async () => {
    const user = wixUsersBackend.currentUser;
    if (!user.loggedIn) throw new Error("Not logged in");

    const results = await wixData.query("Customer_Feedback")
        .eq("_owner", user.id) // Only fetch my own
        .find({ suppressAuth: true });

    return results.items;
});

// 2. ADD NEW CUSTOMER
export const addCustomer = webMethod(Permissions.Anyone, async (customerData) => {
    const user = wixUsersBackend.currentUser;
    if (!user.loggedIn) throw new Error("Not logged in");

    const toSave = {
        ...customerData,
        _owner: user.id // Force ownership
    };

    return await wixData.insert("Customer_Feedback", toSave, { suppressAuth: true });
});

// 3. DELETE CUSTOMER
export const deleteCustomer = webMethod(Permissions.Anyone, async (recordId) => {
    const user = wixUsersBackend.currentUser;
    
    // Security: Ensure the user owns the record before deleting
    const record = await wixData.get("Customer_Feedback", recordId, { suppressAuth: true });
    
    if (record._owner !== user.id) {
        throw new Error("Permission Denied: You do not own this record.");
    }

    await wixData.remove("Customer_Feedback", recordId, { suppressAuth: true });
    return true;
});