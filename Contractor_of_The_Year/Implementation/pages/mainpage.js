import { authentication } from 'wix-members-frontend';
import { getUserRoles, assignNomineeRoleToCurrentUser } from 'backend/multiRole.web';
import wixLocation from 'wix-location';

// We store the current state here so the button knows what to do when clicked
let currentState = "LOADING"; // Options: GUEST, MEMBER, NOMINEE

$w.onReady(async function () {
    
    // 1. Collapse EVERYTHING initially
    const allButtons = ['#mainActionBtn', '#btnAdmin', '#btnJudge', '#btnCoach'];
    allButtons.forEach(btn => $w(btn).collapse());

    // Ensure navigation is fully controlled by code, not designer link settings.
    try {
        $w('#mainActionBtn').link = null;
    } catch (e) {
        // Some Wix element types may not expose a writable link property.
    }

    // 2. Initialize the button state
    await updateButtonState();

    // 3. Define the ONE click handler for the button
    $w('#mainActionBtn').onClick(async () => {
        
        // --- CASE 1: GUEST (Needs to Log In) ---
        if (currentState === "GUEST") {
            try {
                // Open standard Wix Login Popup
                const user = await authentication.promptLogin(); 
                // Wait for popup to close, then re-check status immediately
                await updateButtonState();
            } catch (err) {
                console.log("Login cancelled");
            }
        }

        // --- CASE 2: MEMBER (Needs to "Upgrade" to Nominee) ---
        else if (currentState === "MEMBER") {
            $w('#mainActionBtn').label = "Processing...";
            $w('#mainActionBtn').disable();
            
            try {
                // Call backend to assign role
                const result = await assignNomineeRoleToCurrentUser();
                // Apply new token so frontend reflects updated roles.
                await authentication.applySessionToken(result.sessionToken);

                // Double-check role propagation before navigating to protected page.
                const refreshed = await getUserRoles();
                if (refreshed.loggedIn && refreshed.roleNames.includes("Nominee")) {
                    wixLocation.to(result.redirectUrl || '/nominee-dashboard');
                    return;
                }

                $w('#mainActionBtn').label = "Click again to confirm and continue";
                $w('#mainActionBtn').enable();
            } catch (error) {
                console.error(error);
                $w('#mainActionBtn').label = "Error. Try Again.";
                $w('#mainActionBtn').enable();
            }
        }

        // --- CASE 3: NOMINEE (Already has role) ---
        else if (currentState === "NOMINEE") {
            // Just go to dashboard
            wixLocation.to('/nominee-dashboard');
        }
    });
});

// Helper function to check backend and update UI
async function updateButtonState() {
    try {
        // CALL THE NEW BACKEND FUNCTION
        const status = await getUserRoles();

        // --- LOGIC FOR ADMIN/STAFF ROLES ---
        if (status.loggedIn) {
            // Check list of roles and expand corresponding buttons
            if (status.roleNames.includes("Award Admin")) $w('#btnAdmin').expand();
            if (status.roleNames.includes("Judge")) $w('#btnJudge').expand();
            if (status.roleNames.includes("Nominee Coach")) $w('#btnCoach').expand();
            if (status.roleNames.includes("Assessor")) $w('#btnCoach').expand();
        }

        // --- PART B: MAIN ACTION BUTTON LOGIC ---
        
        // CASE 1: GUEST (Not Logged In)
        if (!status.loggedIn) {
            currentState = "GUEST";
            $w('#mainActionBtn').label = "Log In to Participate";
            $w('#mainActionBtn').show();
            $w('#mainActionBtn').expand();
        } 
        
        // CASE 2: LOGGED IN
        else {
            // Check if they already have the Nominee role
            const isNominee = status.roleNames.includes("Nominee");

            if (isNominee) {
                // Priority 1: User is a Nominee -> Show "View Status"
                currentState = "NOMINEE";
                $w('#mainActionBtn').label = "View Nomination Status";
                $w('#mainActionBtn').show();
                $w('#mainActionBtn').expand();
            } else {
                // Priority 2: Any logged-in non-nominee can start a nomination
                currentState = "MEMBER";
                $w('#mainActionBtn').label = "Start New Nomination";
                $w('#mainActionBtn').show();
                $w('#mainActionBtn').expand();
            }
        }

        // Always enable the button if it is visible
        if ($w('#mainActionBtn').isVisible) {
            $w('#mainActionBtn').enable();
        }

    } catch (error) {
        console.error("Status check failed", error);
        // Fallback for safety
        $w('#mainActionBtn').label = "Log In";
        $w('#mainActionBtn').expand();
    }
}