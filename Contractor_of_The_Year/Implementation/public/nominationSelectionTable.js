// public/nominationSelectionTable.js

/**
 * A reusable class to manage a Wix Table and its associated Search Input.
 */
export class NominationTableManager {
    
    /**
     * @param {Object} $w - The page's $w context.
     * @param {String} tableId - The ID of the table element (e.g., '#coachTable').
     * @param {String} searchId - The ID of the search input element (e.g., '#searchCoach').
     * @param {Array} initialData - The array of nomination records.
     */
    constructor($w, tableId, searchId, initialData) {
        this.$w = $w;
        this.tableId = tableId;
        this.searchId = searchId;
        this.allNominations = initialData || [];
        this.debounceTimer = null;
    }

    /**
     * Initializes the table, sets the data, and binds the search and click events.
     * @param {Function} onRowSelectCallback - Function to run when a row is clicked.
     */
    init(onRowSelectCallback) {
        // 1. Clear Wix Editor placeholder data & set real data
        this.$w(this.tableId).rows = this.allNominations;

        // 2. Table Row Selection
        this.$w(this.tableId).onRowSelect((event) => {
            if (typeof onRowSelectCallback === 'function') {
                onRowSelectCallback(event.rowData);
            }
        });

        // 3. Local Search Filter
        this.$w(this.searchId).onInput((event) => {
            if (this.debounceTimer) clearTimeout(this.debounceTimer);
            
            this.debounceTimer = setTimeout(() => {
                const term = event.target.value.toLowerCase();
                if (!term) {
                    this.$w(this.tableId).rows = this.allNominations;
                    return;
                }
                
                // Filter by Title, Company, OR Nominee Name
                this.$w(this.tableId).rows = this.allNominations.filter(row => {
                    const titleMatch = row.title?.toLowerCase().includes(term);
                    const compMatch = row.company?.toLowerCase().includes(term);
                    const nomMatch = row.nomineeName?.toLowerCase().includes(term);
                    return titleMatch || compMatch || nomMatch;
                });
            }, 300);
        });
    }

    /**
     * Silently updates a record in this specific table's local array.
     * @param {Object} updatedRecord - The updated nomination record from the backend.
     */
    updateTableRow(updatedRecord) {
        const index = this.allNominations.findIndex(n => n._id === updatedRecord._id);
        if (index !== -1) {
            this.allNominations[index] = updatedRecord;
            this.$w(this.tableId).rows = this.allNominations; 
        }
    }
}