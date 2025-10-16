// Accessible Table Component
import { a11y } from '../accessibility/index.js';

export class Table {
  constructor(options = {}) {
    this.data = options.data || [];
    this.columns = options.columns || [];
    this.sortable = options.sortable || false;
    this.sortBy = options.sortBy || '';
    this.sortDirection = options.sortDirection || 'asc';
    this.selectable = options.selectable || false;
    this.selectedRows = options.selectedRows || new Set();
    this.pagination = options.pagination || false;
    this.pageSize = options.pageSize || 10;
    this.currentPage = options.currentPage || 1;
    this.caption = options.caption || '';
    this.ariaLabel = options.ariaLabel || '';
    this.ariaDescribedBy = options.ariaDescribedBy || '';
    this.onSort = options.onSort || (() => {});
    this.onSelect = options.onSelect || (() => {});
    this.onPageChange = options.onPageChange || (() => {});
    this.className = options.className || '';
  }

  render() {
    const tableId = `table-${Math.random().toString(36).substr(2, 9)}`;
    const captionId = this.caption ? `${tableId}-caption` : '';
    const describedBy = [this.ariaDescribedBy, captionId].filter(Boolean).join(' ');
    
    // Build ARIA attributes
    const ariaAttributes = [];
    if (this.ariaLabel) ariaAttributes.push(`aria-label="${this.ariaLabel}"`);
    if (describedBy) ariaAttributes.push(`aria-describedby="${describedBy}"`);
    
    const ariaString = ariaAttributes.length > 0 ? ' ' + ariaAttributes.join(' ') : '';
    
    const captionHtml = this.caption ? `<caption id="${captionId}" class="text-left font-medium text-gray-900 mb-2">${this.caption}</caption>` : '';
    
    const headerHtml = this.renderHeader();
    const bodyHtml = this.renderBody();
    const paginationHtml = this.pagination ? this.renderPagination() : '';
    
    return `
      <div class="overflow-x-auto ${this.className}">
        <table 
          id="${tableId}"
          class="min-w-full divide-y divide-gray-200"
          role="table"
          ${ariaString}
        >
          ${captionHtml}
          ${headerHtml}
          ${bodyHtml}
        </table>
        ${paginationHtml}
      </div>
    `;
  }

  renderHeader() {
    const headerCells = this.columns.map((column, index) => {
      const sortable = this.sortable && column.sortable !== false;
      const isSorted = this.sortBy === column.key;
      const sortDirection = isSorted ? this.sortDirection : 'asc';
      const sortIcon = isSorted ? (sortDirection === 'asc' ? '↑' : '↓') : '';
      
      const sortButton = sortable ? `
        <button 
          class="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          onclick="${this.onSort.toString()}"
          aria-label="Sort by ${column.label} ${isSorted ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}"
          aria-sort="${isSorted ? sortDirection : 'none'}"
        >
          <span>${column.label}</span>
          <span aria-hidden="true">${sortIcon}</span>
        </button>
      ` : `<span class="font-medium text-gray-900">${column.label}</span>`;
      
      return `
        <th 
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          scope="col"
          ${sortable ? 'role="columnheader"' : ''}
        >
          ${sortButton}
        </th>
      `;
    }).join('');
    
    // Add selection column if selectable
    const selectionHeader = this.selectable ? `
      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
        <span class="sr-only">Select all rows</span>
        <input 
          type="checkbox" 
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          onchange="${this.handleSelectAll.toString()}"
          aria-label="Select all rows"
        />
      </th>
    ` : '';
    
    return `
      <thead class="bg-gray-50">
        <tr role="row">
          ${selectionHeader}
          ${headerCells}
        </tr>
      </thead>
    `;
  }

  renderBody() {
    const rows = this.getCurrentPageData().map((row, rowIndex) => {
      const rowId = `row-${rowIndex}`;
      const isSelected = this.selectedRows.has(rowIndex);
      
      const cells = this.columns.map((column, cellIndex) => {
        const value = row[column.key] || '';
        const cellContent = column.render ? column.render(value, row, rowIndex) : value;
        
        return `
          <td 
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            role="gridcell"
            ${cellIndex === 0 ? 'scope="row"' : ''}
          >
            ${cellContent}
          </td>
        `;
      }).join('');
      
      const selectionCell = this.selectable ? `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <input 
            type="checkbox" 
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            ${isSelected ? 'checked' : ''}
            onchange="${this.handleRowSelect.toString()}"
            aria-label="Select row ${rowIndex + 1}"
          />
        </td>
      ` : '';
      
      return `
        <tr 
          role="row"
          id="${rowId}"
          class="${isSelected ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50"
          ${isSelected ? 'aria-selected="true"' : ''}
        >
          ${selectionCell}
          ${cells}
        </tr>
      `;
    }).join('');
    
    return `
      <tbody class="bg-white divide-y divide-gray-200">
        ${rows}
      </tbody>
    `;
  }

  renderPagination() {
    const totalPages = Math.ceil(this.data.length / this.pageSize);
    const startItem = (this.currentPage - 1) * this.pageSize + 1;
    const endItem = Math.min(this.currentPage * this.pageSize, this.data.length);
    
    const pageButtons = Array.from({ length: totalPages }, (_, i) => {
      const page = i + 1;
      const isCurrent = page === this.currentPage;
      
      return `
        <button 
          class="px-3 py-2 text-sm font-medium rounded-md ${
            isCurrent 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }"
          onclick="${this.onPageChange.toString()}"
          aria-label="Go to page ${page}"
          ${isCurrent ? 'aria-current="page"' : ''}
        >
          ${page}
        </button>
      `;
    }).join('');
    
    return `
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" role="navigation" aria-label="Table pagination">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onclick="${this.onPageChange.toString()}"
            ${this.currentPage === 1 ? 'disabled' : ''}
            aria-label="Previous page"
          >
            Previous
          </button>
          <button 
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onclick="${this.onPageChange.toString()}"
            ${this.currentPage === totalPages ? 'disabled' : ''}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">${startItem}</span> to <span class="font-medium">${endItem}</span> of <span class="font-medium">${this.data.length}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              ${pageButtons}
            </nav>
          </div>
        </div>
      </div>
    `;
  }

  getCurrentPageData() {
    if (!this.pagination) return this.data;
    
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  handleSelectAll(event) {
    const checked = event.target.checked;
    if (checked) {
      this.selectedRows = new Set(this.data.map((_, index) => index));
    } else {
      this.selectedRows = new Set();
    }
    this.onSelect(this.selectedRows);
  }

  handleRowSelect(event) {
    const rowIndex = parseInt(event.target.closest('tr').id.split('-')[1]);
    if (event.target.checked) {
      this.selectedRows.add(rowIndex);
    } else {
      this.selectedRows.delete(rowIndex);
    }
    this.onSelect(this.selectedRows);
  }
}